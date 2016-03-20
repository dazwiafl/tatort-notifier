var Crawler = require("crawler")
  , searchStr = 'tatort'
  , moment = require('moment')
  , url = 'http://www.ard-text.de'
  , exec = require('child_process').exec
  , _ = require('underscore')
  , curl = '/usr/bin/curl'
  , iftttmakerurl = 'YOUR_MAKER_URL_HERE'
;

var c = new Crawler()
  , doSecond = function(href){
      c.queue(
        [
          {
            uri: url+href
            , callback: function(error, result, $){
                var end = ($('.pageWrapper .master .std').first().text().split(' - ')[1]).split(" ")[0];
                var endst = moment((moment().format('YYYY-MM-DD HH:mm').toString().split(' ')[0])+' '+end, 'YYYY-MM-DD HH:mm').format('x');
                var now = moment().format('x');
                var threshold = 60*1000*2; //substract 2 minutes because of advertisment
                var delay = endst-now-threshold;
                delay = delay < 1 ? 1 : delay;
                
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
      var breaker = false;
      $('.pageWrapper .master .std > div').each(function(){
        var t = $(this).text().toLowerCase()
          , h = $(this).html()
        ;

        if(t.indexOf(searchStr) > -1){
          t = t.split('\r').join('').split('\n').join(' ').split('\t').join('').trim();
          var hour = parseInt((t.split(' ')[0]).split(':')[0],10);
          var hours = [20,21,22];

          var year = parseInt(((t.split('fernsehfilm, ')[1]).split(' ')[1]).split(')')[0],10);
          var actyear = parseInt(moment().format('YYYY').toString(),10);
          var years = [ actyear, actyear-1 ];
          if(parseInt(moment().format('MM').toString(), 10)<=6)
            years.push(actyear-2);
          
          if( _.contains(hours, hour) && _.contains(years, year) ){
            var href = $(this).find('a').first().attr('href');
            doSecond(href);
            breaker = true;
          }else{ process.exit() }
        }
      });
      if(!breaker){
        process.exit();
      }
    }
  }]
);
