import { single, singlepatti, doublepatti, tripalpatti, jodi } from './../../../components/variable/global'

export const stringSeprator = (digit) => {
    digit = String(digit);
    var digitArray = [];
    for(var i = 0; digit.length > i; i++){
        digitArray.push(digit[i]);
    }
    return digitArray;
}
export const sumofArray = (dsplit) => {
    var sum = dsplit.reduce(function(a, b){
        return  Number(a) + Number(b);
    }, 0);
    return sum;
}

export const findDigitSuggesion = (digit) => {
    var dsplit = stringSeprator(digit);
    var sum = String(sumofArray(dsplit));
    var findDigit = null;

    if(sum.length === 1){
        findDigit = sum;
    }else{
        var suml = stringSeprator(sum);
        findDigit = suml.length === 1 ? suml[0] : suml[1];
    }

    var combine = [...single, ...singlepatti, ...doublepatti, ...tripalpatti, ...jodi];
    var unlisted = [];
    for (var index = 0; index <= combine.length; index++) {
        
            var indexsplit = stringSeprator(combine[index]);
            var indexSum = String(sumofArray(indexsplit));
            var indexfindDigit = null;

            if(indexSum.length === 1){
                indexfindDigit = indexSum;
            }else{
                var indexSuml = stringSeprator(indexSum);
                indexfindDigit = indexSuml.length === 1 ? indexSuml[0] : indexSuml[1];
            }
            if (indexfindDigit === findDigit){
                unlisted.push(combine[index]);
            }
    }

    return unlisted;
    
};