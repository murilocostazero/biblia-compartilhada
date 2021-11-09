import bible from '../files/bible.json';

export default class Bible {
    getChaptersList() {
        let chapters = bible.map((data) => { return data.name });
        return chapters;
    }

    getVersesList(chapter) {
        let verses = bible.filter(
            function (data) { return data.name == chapter }
        );

        let versesLength = verses[0].chapters.length;
        let versesArray = [];
        for (let i = 0; i < versesLength; i++) {
            versesArray.push(i)
        }

        return versesArray;
    }

    getChapter(choosedBook, chapterNumber) {
        let chapter = bible.filter(
            function (data) {
                return data.name == choosedBook
            });

        let chapterArrayObject = [];
        let chapterArray = chapter[0].chapters[chapterNumber];
        for (let i = 0; i < chapterArray.length; i++) {
            chapterArrayObject.push({
                id: i,
                verse: chapterArray[i],
                isSelected: false
            });
        }
        return chapterArrayObject;
    }

    getVerse(query) {
        const localBible = bible;
        const searchResult = [];

        return new Promise((resolve, reject) => {
            for (let i = 0; i < localBible.length; i++) {
                const book = localBible[i];
                const chapters = book.chapters;
                for (let j = 0; j < chapters.length; j++) {
                    const chapter = chapters[j];
                    for (let k = 0; k < chapter.length; k++) {
                        const verse = chapter[k].toLowerCase();
                        if (verse.includes(query)) {
                            const result = {
                                book: book.name,
                                chapter: j,
                                verse: {
                                    id: k,
                                    text: verse
                                }
                            }
                            searchResult.push(result);
                        }
                    }
                }
            }
            return resolve(searchResult);
        });
    }

    goToNextChapter(currentChapter){
        let bookIndex = bible.findIndex((item) => item.name == currentChapter.choosedBook);
        const bookChapters = bible[bookIndex].chapters.length;

        if(currentChapter.chapter < bookChapters-1){
            //Avançar um capitulo
            return { chapter: (currentChapter.chapter+1), choosedBook: currentChapter.choosedBook };
        } else if(currentChapter.chapter == bookChapters-1 && bookIndex < bible.length-1){
            //Avançar o livro o livro
            return { chapter: 0, choosedBook: bible[bookIndex+1].name };
        } else {
            //Não avançar
           return null;
        }
    }

    goToPreviousChapter(currentChapter){
        let bookIndex = bible.findIndex((item) => item.name == currentChapter.choosedBook);

        if(currentChapter.chapter > 0){
            //Voltar um capitulo
            return { chapter: (currentChapter.chapter - 1), choosedBook: currentChapter.choosedBook };
        } else if(currentChapter.chapter == 0 && bookIndex > 0){
            //Voltar o livro
            return { chapter: (bible[bookIndex-1].chapters.length-1), choosedBook: bible[bookIndex-1].name };
        } else {
            //Não voltar
           return null;
        }
    }

    getSingleVerse(selectedItem){
        const book = bible.find((item) => item.name == selectedItem.choosedBook);
        return book.chapters[selectedItem.chapter][selectedItem.verse];
    }
}