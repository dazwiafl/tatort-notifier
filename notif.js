var Crawler = require("crawler")
  , searchStr = 'tatort'
  , moment = require('moment')
  , url = 'http://www.ard-text.de'
  , exec = require('child_process').exec
  , curl = '/usr/bin/curl'
  , iftttmakerurl = 'https://maker.ifttt.com/trigger/tatort/with/key/XXX'
;

var c = new Crawler()
  , doSecond = function(href){
      c.queue(
        [
          {
            uri: url+href
            , callback: function(error, result, $){
                var end = (($('.pageWrapper .master .std').first().text().split(", ")[1]).split(' - ')[1]).split(" ")[0];
                var endst = moment((moment().format('YYYY-MM-DD HH:mm').toString().split(' ')[0])+' '+end, 'YYYY-MM-DD HH:mm').format('x');
                var now = moment().format('x');
                var delay = endst-now;
                setTimeout(function(){
                  exec(curl+' -X POST '+iftttmakerurl, function(error, stdout, stderr) {
                    process.exit();
                  });
                }, delay);
              }
          }
        ]
      );
    }
;

c.queue([{
  uri: url+'/mobil/303'
  , callback : function (error, result, $) {
      $('.pageWrapper .master .std > div').each(function(){
        var t = $(this).text().toLowerCase()
        ;

        if(t.indexOf(searchStr) > -1){
          t = t.split('\r').join('').split('\n').join(' ').split('\t').join('').trim();
          var hour = parseInt((t.split(' ')[0]).split(':')[0],10);
          var year = parseInt(((t.split('(')[1]).split(' ')[1]).split(')')[0],10);
          var actyear = parseInt(moment().format('YYYY').toString(),10);
          var beforeactyear = actyear-1;
          if((hour == 20 || hour == 21 || hour == 22)&&(actyear == year || beforeactyear == year)){
            var href = $(this).find('a').first().attr('href');
            doSecond(href);
          }else{ process.exit() }
        }
      });
    }
  }]
);
