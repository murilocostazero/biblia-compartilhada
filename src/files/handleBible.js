import bible from './bible.json';

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
        for(let i = 0; i < versesLength; i++){
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
        for(let i = 0; i < chapterArray.length; i++){
            chapterArrayObject.push({   
                    id: i,
                    verse: chapterArray[i],
                    isSelected: false
                });
        }
        return chapterArrayObject;
    }
}