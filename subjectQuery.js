
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

query_url = 'http://sugang.snu.ac.kr/sugang/cc/cc100.action';
post_options = (subject_id, options) => ({
    srchCond: 0,
    pageNo: 1,
    workType: 'S',
    sortKey: null,
    sortOrder: null,
    srchOpenSchyy: 2019,
    currSchyy: 2019,
    srchOpenShtm: 'U000200002U000300001',
    currShtmNm: '2학기',
    srchCptnCorsFg: null,
    srchOpenShyr: null,
    srchSbjtCd: subject_id,
    srchSbjtNm: null,
    srchOpenUpSbjtFldCd: null,
    srchOpenSbjtFldCd: null,
    srchOpenUpDeptCd: null,
    srchOpenDeptCd: null,
    srchOpenMjCd: null,
    srchOpenSubmattCorsFg: null,
    srchOpenSubmattFgCd: null,
    srchOpenPntMin: null,
    srchOpenPntMax: null,
    srchCamp: null,
    srchBdNo: null,
    srchProfNm: options.profName ? options.profName : null,
    srchTlsnAplyCapaCntMin: null,
    srchTlsnAplyCapaCntMax: null,
    srchTlsnRcntMin: null,
    srchTlsnRcntMax: null,
    srchOpenSbjtTmNm: null,
    srchOpenSbjtTm: null,
    srchOpenSbjtTmVal: null,
    srchLsnProgType: null,
    srchMrksGvMthd: null,
    srchFlag: null,
    inputTextView: null,
    inputText: null,
});

const headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'enter=Y; WMONID=V87_bCRuE7s; JSESSIONID=OO9hvE9IBxaDgaTWQwMjyNNbzqnCZP7MEahCzFEDVxAFVUoLyMJw2L6PPBkjnkam.giants2_servlet_engine2',
    'Host': 'sugang.snu.ac.kr',
    'Origin': 'http://sugang.snu.ac.kr',
    'Referer': 'http://sugang.snu.ac.kr/sugang/cc/cc100.action',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
};

const get_subject_status = (subject_id, options) => {
    return rp({
        method : 'POST',
        uri: query_url,
        form : post_options(subject_id, options),
        json: true,
        headers : headers,
    }).then((res) => {
        let $ = cheerio.load(res);
        let selector = '#content div div.seach_cont.mt_30 div.tbl_sec div.gray_top table tbody tr';
        fs.writeFile('log.dat',res, 'utf8', (x) => {});
        let result = $(selector).map(function(idx, el){
            if($(this).find('td').get().length > 10){
                try{
                    let name = $(this).find('td:nth-child(14)').text();
                    let teacher = $(this).find('td:nth-child(19)').text();
                    let status = $(this).find('td:nth-child(21)').text();
                    let maximum = parseInt(status.split('(')[1].split(')')[0], 10);
                    let current = parseInt($(this).find('td:nth-child(22)').text(), 10);
                    //console.log(subject_id, name, current, maximum);
                    return {name, teacher, maximum, current};
                }catch(e){
                    fs.appendFile('error.log', 'Error occured in parsing ' + subject_id + '\n' + $(this).html(), 'utf8', () => {});
                    fs.writeFile('raw.html', res, 'utf8', () => {});
                    console.log(e);
                }
            }else{
                return null;
            }
        }).get();
        result = result.filter(x => x);
        return result;
    });
}


module.exports = get_subject_status;
//#content > div > div.seach_cont.mt_30 > div.tbl_sec > div.gray_top > table > tbody > tr:nth-child(1) > td:nth-child(21)