import { Banner } from '@/entities/banner';
import { ClothItem } from '@/entities/cloth';
import { HomeCategorySelector } from '@/features/category';
import { FlatList } from 'react-native';
import items from './items.json';
import { Header } from '@/widgets/header/ui/Header';

export function Home() {
    return (
        <FlatList
            data={items}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
                <>
                    <Header />
                    <Banner />
                    <HomeCategorySelector />
                </>
            }
            contentContainerClassName="px-4 pb-4"
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            renderItem={({ item }) => <ClothItem item={item} />}
        />
    );
}
