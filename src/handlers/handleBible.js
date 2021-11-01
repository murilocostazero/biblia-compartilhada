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
                        const verse = chapter[k];
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
}