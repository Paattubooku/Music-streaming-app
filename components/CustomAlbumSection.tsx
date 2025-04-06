import { decode } from "html-entities";
import { FlatList, Image, Text, TouchableOpacity } from "react-native";
type AlbumItem = {
    id?: string | number;
    title: string;
    image?: string;
};

type CustomAlbumSectionProps = {
    title: string;
    data: AlbumItem[];
};
const CustomAlbumSection: React.FC<CustomAlbumSectionProps> = ({ title, data }) => {
    if (!data || data.length === 0) return null;

    return (
        <>
            <Text
                style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 10,
                    marginTop: 20,
                    alignSelf: "flex-start",
                }}
            >
                {title}
            </Text>

            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            marginRight: 12,
                            alignItems: "center",
                            width: 120,
                        }}
                    >
                        <Image
                            source={{
                                uri: item.image?.replace("150x150.jpg", "500x500.jpg"),
                            }}
                            style={{ width: 120, height: 120, borderRadius: 8 }}
                        />
                        <Text
                            style={{
                                color: "white",
                                marginTop: 5,
                                textAlign: "center",
                            }}
                            numberOfLines={1}
                        >
                            {decode(item.title)}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </>
    );
};


export default CustomAlbumSection;