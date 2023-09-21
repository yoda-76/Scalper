dateList=[
    {value:"2023-07-04T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
    {value:"2023-07-11T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
    {value:"2023-07-15T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
    {value:"2023-07-21T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
    {value:"2023-07-27T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},
    {value:"2023-08-27T00:00:00.000Z", item: "2023-07-27T00:00:00.000Z"},

]
const date="2023-08-27T00:00:00.000Z"
const name="NIFTY"
const price="16050"
const type="CE"
function formater(name, price, dateList, date, type){

    let formatedName;
    //2023-07-27T00:00:00.000Z
    // console.log(
    const trimedDate=date.split('T')[0]
    const trimedDateList=(dateList.map(item=>item.value.split('T')[0]))
    trimedDateList.map((date,index)=>{
        if(date==trimedDate){
            // console.log(trimedDateList[index+1])
            if(trimedDateList[index+1]&&trimedDateList[index+1].substring(5,7)===date.substring(5,7)){
                formatedName= name+trimedDate.substring(2,4)+(trimedDate.substring(5,6)==='0'?trimedDate.substring(6,7):trimedDate.substring(5,7))+trimedDate.substring(8)+price+type
            }
            else{
                function getShortMonth(monthNumber) {
                    switch (monthNumber) {
                      case "01":
                        return 'JAN';
                      case "02":
                        return 'FEB';
                      case "03":
                        return 'MAR';
                      case "04":
                        return 'APR';
                      case "05":
                        return 'MAY';
                      case "06":
                        return 'JUN';
                      case "07":
                        return 'JUL';
                      case "08":
                        return 'AUG';
                      case "09":
                        return 'SEP';
                      case 10:
                        return 'OCT';
                      case 11:
                        return 'NOV';
                      case 12:
                        return 'DEC';
                      default:
                        return 'Invalid month';
                    }
                  }
                formatedName= name+trimedDate.substring(2,4)+getShortMonth(trimedDate.substring(5,7))+price+type
            }
        }
    })

return formatedName
}
console.log(formater(name,price,dateList,date,type))