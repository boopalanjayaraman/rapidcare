import tamilText from "./text-ta";
import englishText from "./text-en";

export const textProvider = (language)  => {

    if(!language){
        language = localStorage["chosen_language"] ?? "en";
    }
    
    if(language === 'en'){
        return englishText;
    }
    else if(language === 'ta'){
        return tamilText;
    }
    return englishText;
};