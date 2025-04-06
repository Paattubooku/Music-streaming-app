import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `https://mserver-pi.vercel.app/`;

// Helper function to fetch selected language from AsyncStorage
const getLanguageFromAsyncStorage = async (): Promise<string> => {
  try {
    const selectedLanguages = await AsyncStorage.getItem("selectedLanguages");
    return selectedLanguages ? JSON.parse(selectedLanguages).join(",") : "English,tamil";
  } catch (error) {
    console.error("Error parsing selectedLanguages:", error);
    return "English";
  }
};

// Centralized API call function
const fetchFromApi = async (endpoint: string) => {
  const selectedLanguage = encodeURIComponent(await getLanguageFromAsyncStorage());
  const response = await axios.get(`${BASE_URL}${endpoint}&language=${selectedLanguage}`);
  console.log(`${BASE_URL}${endpoint}&language=${selectedLanguage}`)
  // console.log("response",response.data)
  return response.data;

};

// Define Types
interface SongDetails {
  id: string;
  encrypted_media_url?: string;
  urlid?: { encrypted_media_url?: string };
}

interface FetchParams {
  id?: string;
  type?: string;
  title?: string;
  source?: string;
  data?: string;
  urlid?: string;
}

interface RadioDetails {
  id: string;
  n?: string;
  l?: string;
}

// Define Initial State
interface LaunchState {
  launchData: any;
  autocompleteData: any;
  Details: any;
  SingleAlbumDetails: any;
  currentSongIndex: any;
  isRadio: boolean;
  currentlyPlayingTrack: any;
  AudioQueue: any[];
  RadioSongs: any;
  playNext: any;
  StationId: any;
  topSearchData: any;
  loading: boolean;
  error: string | null;
}

const initialState: LaunchState = {
  launchData: null,
  autocompleteData: null,
  Details: null,
  SingleAlbumDetails: null,
  currentSongIndex: {},
  isRadio: false,
  currentlyPlayingTrack: null,
  AudioQueue: [],
  RadioSongs: null,
  playNext: null,
  StationId: null,
  topSearchData: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchLaunchData = createAsyncThunk('launch/fetchLaunchData', async () =>
  fetchFromApi(`?`)
);

export const fetchAutocompleteData = createAsyncThunk('launch/fetchAutocompleteData', async (query: string) =>
  fetchFromApi(`search?q=${encodeURIComponent(query)}`)
);

export const fetchTopSearch = createAsyncThunk('launch/fetchTopSearch', async () =>
  fetchFromApi(`topsearch?`)
);

export const fetchDetails = createAsyncThunk('launch/fetchDetails', async ({ type, id }: FetchParams) =>{
  const data = await fetchFromApi(`details/${id}/${type}`)
  return data
}
);

export const fetchOtherDetails = createAsyncThunk('launch/fetchOtherDetails', async ({ title, source, data }: FetchParams) =>
  fetchFromApi(`otherDetails/${title}/${source}/${data}`)
);

export const fetchSingleAlbumDetails = createAsyncThunk('launch/fetchSingleAlbumDetails', async ({ id }: FetchParams) =>
  fetchFromApi(`album/${id}`)
);

export const fetchSingleSongDetails = createAsyncThunk('launch/fetchSingleSongDetails', async ({ id }: FetchParams) => {
  const data = await fetchFromApi(`song/${id}`);
  return data[id || ""];
});

export const fetchAudioDetails = createAsyncThunk('launch/fetchAudioDetails', async (data: SongDetails[]) => {
  const responses = await Promise.all(
    data.map(({ id, urlid, encrypted_media_url }) =>
      fetchFromApi(`mediaURL/${id}/${encodeURIComponent(urlid?.encrypted_media_url || encrypted_media_url || '')}`)
    )
  );
  return responses;
});

export const fetchRadioDetails = createAsyncThunk('launch/fetchRadioDetails', async ({ id, n, l }: RadioDetails) => {
  if (id && !n && !l) return fetchFromApi(`radioNew?query=${id}`);
  if (!id && n && l) return fetchFromApi(`radioNew?name=${n}&l=${l}`);
  return fetchFromApi(`radioNew?name=${n}`);
});

export const fetchMoreRadioDetails = createAsyncThunk('launch/fetchMoreRadioDetails', async ({ id, k }: { id: string; k: string }) =>
  fetchFromApi(`moreRadioNew/${id}/${k}`)
);

// Redux Slice
const apiSlice = createSlice({
  name: 'launch',
  initialState,
  reducers: {
    clearDetailsData: (state) => {
      state.Details = null;
    },
    clearSingleAlbumDetailsData: (state) => {
      state.SingleAlbumDetails = null; // Reset autocomplete data to null
    },
    clearAudioQueue: (state) => {
      state.AudioQueue = []; // Reset autocomplete data to null
    },
    clearRadioSongs: (state) => {
      state.RadioSongs = null; // Reset autocomplete data to null
    },
    updateAudioQueue: (state, action: PayloadAction<any[]>) => {
      state.AudioQueue = action.payload;
    },
    updateSongIndex: (state, action: PayloadAction<{}>) => {
      state.currentSongIndex = action.payload;
    },
    updateIsRadio: (state, action: PayloadAction<boolean>) => {
      state.isRadio = action.payload;
    },
    updateCurrentlyPlayingTrack: (state, action: PayloadAction<any>) => {
      state.currentlyPlayingTrack = action.payload;
    },
    updatePlayNext: (state, action: PayloadAction<any>) => {
      state.playNext = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaunchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaunchData.fulfilled, (state, action) => {        
        state.loading = false;
        state.launchData = action.payload;
      })
      .addCase(fetchLaunchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetails.fulfilled, (state, action) => {    
        state.loading = false;
        state.Details = action.payload;
      })
      .addCase(fetchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(fetchOtherDetails.pending, (state) => {
        state.loading = true;  // Set loading state to true when fetching
        state.error = null;    // Reset error state
      })
      .addCase(fetchOtherDetails.fulfilled, (state, action) => {
        state.loading = false; // Set loading state to false when fetched
        // Check if Details is an object and merge the fetched data
        if (state.Details && typeof state.Details === 'object') {
          state.Details = { ...state.Details, ...action.payload }; // Merge the fetched data
        } else {
          state.Details = action.payload; // Set new state if Details is not an object
        }
      })
      .addCase(fetchOtherDetails.rejected, (state, action) => {
        state.loading = false; // Set loading state to false if fetching fails
        state.error = action.error.message || null; // Store error message
      })

      .addCase(fetchTopSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.topSearchData = action.payload;
      })
      .addCase(fetchTopSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { clearDetailsData, clearSingleAlbumDetailsData, clearAudioQueue, clearRadioSongs, updateAudioQueue, updateSongIndex, updateIsRadio, updateCurrentlyPlayingTrack, updatePlayNext } =
  apiSlice.actions;
export default apiSlice.reducer;
