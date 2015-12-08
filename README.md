# tatort-notifier

Small and simple nodejs commandline app to scrape teletext data of "Das Erste" (ARD) and get the information if today is a new Tatort or not.

It's using the mobile version of teletext (ard-text.de/mobile) because it's easier to fetch and process. Also the teletext data is more accurate than data of TV Magazines or stolen EPG data in some circumstances (for instance: something big (or shitty) has happened and there is a "Brennpunkt" @ 8:15pm delaying the Tatort for 15min). The script is also checking if the production date of the episode is in this or the last year (normally just the case in January or with the delayed once of Til Schweiger ;) ) so that the notification triggers only if it's really a new Tatort.

Best executed via **cronjob** on a daily basis (because of :christmas_tree:-episodes which have a certain chance of not being aired on sundays ;)

```40 21 * * * /PATH_TO_NODE/node /PATH_TO_NOTIFIER/notif.js```


I know, I know it's pretty dirty and hacky and breaks if the data changes, but ```¯\_(ツ)_/¯```
