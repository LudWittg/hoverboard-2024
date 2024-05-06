/* eslint-disable */

import express from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import * as cheerio from 'cheerio';

const app = express();

const staticHtml = `
<!DOCTYPE html><html itemscope="" itemtype="http://schema.org/Event" lang="en" prefix="og: http://ogp.me/ns#"><head>
    <base href="/">
    <meta charset="utf-8">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes" name="viewport">
    <meta content="Join the DevFest Pisa, a tech conference carefully crafted for you by the GDG Pisa! A 100% community based event, all about Android, Web, Cloud and more!" name="description">
    <meta content="event, gdg, gde, devfest, google, programming, android, chrome, polymer, developers, web, cloud, androiddev" name="keywords">
    <meta content="GDG Pisa" name="author">
    <meta content="Project Hoverboard" name="generator">
    <title>GDG Pisa DevFest 2024</title>
    <!-- Config from compilation step -->
    <meta content="https://devfest.gdgpisa.it/" name="config-url">
    <meta content="/" name="config-basepath">
    <meta content="AIzaSyAKOkGjmfBPTuYlDyPxlrSj7H-1oqWET7E" name="config-google-maps-api-key">

    <link href="https://devfest.gdgpisa.it/" rel="canonical">
    <link href="images/favicon.ico" rel="icon">
    <meta content="#c62828" name="theme-color">
    <link href="manifest.webmanifest" rel="manifest">

    <!-- Add to homescreen for Chrome on Android -->
    <meta content="yes" name="mobile-web-app-capable">
    <!-- fallback for manifest.json -->
    <meta content="GDG Pisa DevFest 2024" name="application-name">

    <!-- Add to homescreen for Safari on iOS -->
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style">
    <meta content="GDG Pisa DevFest 2024" name="apple-mobile-web-app-title">

    <!-- Homescreen icons. -->
    <link href="images/manifest/icon-48.png" rel="apple-touch-icon">
    <link href="images/manifest/icon-72.png" rel="apple-touch-icon" sizes="72x72">
    <link href="images/manifest/icon-96.png" rel="apple-touch-icon" sizes="96x96">
    <link href="images/manifest/icon-144.png" rel="apple-touch-icon" sizes="144x144">
    <link href="images/manifest/icon-192.png" rel="apple-touch-icon" sizes="192x192">

    <!-- Tile icon for Win8 (144x144 + tile color) -->
    <meta content="images/manifest/icon-144.png" name="msapplication-TileImage">
    <meta content="#00aba9" name="msapplication-TileColor">
    <meta content="no" name="msapplication-tap-highlight">

    <!-- Facebook sharing meta data -->
    <meta content="GDG Pisa DevFest 2024" property="og:title">
    <meta content="GDG Pisa DevFest 2024" property="og:site_name">
    <meta content="website" property="og:type">
    <meta content="https://devfest.gdgpisa.it/" property="og:url">
    <meta content="Join the DevFest Pisa, a tech conference carefully crafted for you by the GDG Pisa! A 100% community based event, all about Android, Web, Cloud and more!" property="og:description">
    <meta content="https://devfest.gdgpisa.it/images/social-share.jpg" property="og:image">
    <meta content="image/jpeg" property="og:image:type">
    <meta property="og:locale" content="en_US" />

    <!-- Twitter meta data -->
    <meta content="summary_large_image" name="twitter:card">
    <meta content="@gdgpisa" name="twitter:creator">
    <meta content="GDG Pisa DevFest 2024" name="twitter:title">
    <meta content="Join the DevFest Pisa, a tech conference carefully crafted for you by the GDG Pisa! A 100% community based event, all about Android, Web, Cloud and more!" name="twitter:description">
    <meta content="https://devfest.gdgpisa.it/images/social-share.jpg" name="twitter:image">
    <meta name="twitter:label1" value="Location">
    <meta name="twitter:data1" value="Polo Fibonacci">
    <meta name="twitter:label2" value="Date">
    <meta name="twitter:data2" value="April 1st 2024">
  </head>
  <body>
    <h1>GDG Pisa DevFest 2024</h1>
  </body>
</html>
`;


// @cortinico: Sadly I wasn't able to find an easy way to access hosting files.
// So here I'm just hardcoding the content of `/dist/index.html`.
const userFacingHtml = `
<!doctype html><html itemscope="" itemtype="http://schema.org/Event" lang="en" prefix="og: http://ogp.me/ns#"><head><base href="/"><meta charset="utf-8"><meta content="IE=edge" http-equiv="X-UA-Compatible"><meta content="width=device-width,minimum-scale=1,initial-scale=1,user-scalable=yes" name="viewport"><meta content="Join the DevFest Pisa, a tech conference carefully crafted for you by the GDG Pisa! A 100% community based event, all about Android, Web, Cloud and more!" name="description"><meta content="event, gdg, gde, devfest, google, programming, android, chrome, polymer, developers, web, cloud, androiddev" name="keywords"><meta content="GDG Pisa" name="author"><meta content="Project Hoverboard" name="generator"><title>GDG Pisa DevFest 2024</title><meta content="https://devfest.gdgpisa.it/" name="config-url"><meta content="/" name="config-basepath"><meta content="AIzaSyCJqlRVGIe6bfU43rga3cnK7tSXXwc7JD8" name="config-google-maps-api-key"><link href="https://devfest.gdgpisa.it/" rel="canonical"><link href="images/favicon.ico" rel="icon"><meta content="#c62828" name="theme-color"><link href="manifest.webmanifest" rel="manifest"><meta content="yes" name="mobile-web-app-capable"><meta content="GDG Pisa DevFest 2024" name="application-name"><meta content="yes" name="apple-mobile-web-app-capable"><meta content="black-translucent" name="apple-mobile-web-app-status-bar-style"><meta content="GDG Pisa DevFest 2024" name="apple-mobile-web-app-title"><link href="images/manifest/icon-48.png" rel="apple-touch-icon"><link href="images/manifest/icon-72.png" rel="apple-touch-icon" sizes="72x72"><link href="images/manifest/icon-96.png" rel="apple-touch-icon" sizes="96x96"><link href="images/manifest/icon-144.png" rel="apple-touch-icon" sizes="144x144"><link href="images/manifest/icon-192.png" rel="apple-touch-icon" sizes="192x192"><meta content="images/manifest/icon-144.png" name="msapplication-TileImage"><meta content="#00aba9" name="msapplication-TileColor"><meta content="no" name="msapplication-tap-highlight"><meta content="GDG Pisa DevFest 2024" property="og:title"><meta content="GDG Pisa DevFest 2024" property="og:site_name"><meta content="website" property="og:type"><meta content="https://devfest.gdgpisa.it/" property="og:url"><meta content="Join the DevFest Pisa, a tech conference carefully crafted for you by the GDG Pisa! A 100% community based event, all about Android, Web, Cloud and more!" property="og:description"><meta content="https://devfest.gdgpisa.it//images/social-share.jpg" property="og:image"><meta content="image/jpeg" property="og:image:type"><meta property="og:locale" content="en_US"><meta content="summary_large_image" name="twitter:card"><meta content="@gdgpisa" name="twitter:creator"><meta content="GDG Pisa DevFest 2024" name="twitter:title"><meta content="Join the DevFest Pisa, a tech conference carefully crafted for you by the GDG Pisa! A 100% community based event, all about Android, Web, Cloud and more!" name="twitter:description"><meta content="https://devfest.gdgpisa.it//images/social-share.jpg" name="twitter:image"><meta name="twitter:label1" value="Location"><meta name="twitter:data1" value="Polo Fibonacci"><meta name="twitter:label2" value="Date"><meta name="twitter:data2" value="June 1st 2024"><link href="https://fonts.googleapis.com" rel="preconnect"><link href="https://firestore.googleapis.com" rel="preconnect"><link href="https://fonts.googleapis.com/css?family=Product+Sans:400&amp;lang=en" rel="stylesheet"><script>window.process={env:{NODE_ENV:"production"}},window.Polymer={rootPath:"/"},function(){var e,t,n,i,o={passive:!0,capture:!0},r=new Date,a=function(){i=[],t=-1,e=null,u(addEventListener)},c=function(i,o){e||(e=o,t=i,n=new Date,u(removeEventListener),s())},s=function(){if(t>=0&&t<n-r){var o={entryType:"first-input",name:e.type,target:e.target,cancelable:e.cancelable,startTime:e.timeStamp,processingStart:e.timeStamp+t};i.forEach((function(e){e(o)})),i=[]}},f=function(e){if(e.cancelable){var t=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,t){var n=function(){c(e,t),r()},i=function(){r()},r=function(){removeEventListener("pointerup",n,o),removeEventListener("pointercancel",i,o)};addEventListener("pointerup",n,o),addEventListener("pointercancel",i,o)}(t,e):c(t,e)}},u=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(t){return e(t,f,o)}))},p="hidden"===document.visibilityState?0:1/0;addEventListener("visibilitychange",(function e(t){"hidden"===document.visibilityState&&(p=t.timeStamp,removeEventListener("visibilitychange",e,!0))}),!0),a(),self.webVitals={firstInputPolyfill:function(e){i.push(e),s()},resetFirstInputPolyfill:a,get firstHiddenTime(){return p}}}(),window.firebase={initializeApp:e=>{window.firebaseConfig=e,delete window.firebase}}</script><script src="/__/firebase/init.js"></script><style>body,html{min-height:100%;height:100%}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5}*,:after,:before{box-sizing:border-box;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased}hoverboard-app[unresolved]{padding:0 16px;display:block;font-weight:600;color:#202020;overflow:visible;display:flex;align-items:center;vertical-align:middle;height:100%;justify-content:center;font-size:2rem}</style></head><body><hoverboard-app unresolved="">GDG Pisa DevFest 2024</hoverboard-app><noscript>Please enable JavaScript to view this website.</noscript><script type="module" src="./app-install-a4aed3da.js"></script><script type="module" src="./service-worker-registration-f06be5f7.js"></script><script type="module" src="./hoverboard-app-ae8219d5.js"></script></body></html>
`;

/**
 * checkForBots() - regex that UserAgent, find me a linkbot
 * @param {String} userAgent
 */
const checkForBots = (userAgent) => {
  // These are link bots only!
  // DO NOT ADD GOOGLEBOT.
  // If you add Googlebot to this, you will not have a good day.
  // This is a mix of Sam Li's list (https://github.com/webcomponents/webcomponents.org/blob/696eb6d6f1fe955db395e96d97c3d1dfe0a02b26/client/bot-filter.py#L9)
  // and my list (https://github.com/justinribeiro/blog-pwa/blob/a7174657f3e910cacf2f089c012d40bec719293e/appengine/main.py#L28)
  const botList =
    'baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|slackbot|facebot|developers.google.com/+/web/snippet/'.toLowerCase();

  // FIND THE BOT AMONG THE USSSERRRS
  return userAgent.toLowerCase().search(botList) !== -1;
};

const getSiteDomain = async () => {
  const doc = await getFirestore().collection('config').doc('site').get();
  return doc?.data()?.domain;
};

const getContent = async (collectionName, dest) => {
  const slug = dest.slice(dest.lastIndexOf('/') + 1);
  const doc = await getFirestore().collection(collectionName).doc(slug).get();
  return doc;
};

const updateOgUrl = ($, dest) => {
  $('meta[property=og\\:url]').attr('content', dest);
  $('link[rel=canonical]').attr('href', dest);
};
const updateOgImage = ($, dest) => {
  $('meta[property=og\\:image]').attr('content', dest);
  $('meta[name=twitter\\:image]').attr('content', dest);
};
const updateOgTitle = ($, dest) => {
  $('meta[property=og\\:title]').attr('content', dest);
  $('meta[name=twitter\\:title]').attr('content', dest);
  $('title').text(dest);
};
const updateOgDescription = ($, dest) => {
  $('meta[property=og\\:description]').attr('content', dest);
  $('meta[name=twitter\\:description]').attr('content', dest);
};

// This WILL NOT run for index.html because Exact-match static content is before
// configured rewrites (see "Hosting Priorities" https://firebase.google.com/docs/hosting/url-redirects-rewrites)
//
// The trick is on L66, pwaShell(): You must update that file! Open for explainer.
app.get('*', async (req, res) => {
  // What say you bot tester?
  const botResult = checkForBots(req.headers['user-agent']);
  if (botResult) {
    const requestPath = req.originalUrl;
    const siteDomain = await getSiteDomain();

    const $ = cheerio.load(staticHtml);

    // console.log('### DBG prerender - ', requestPath);
    if (siteDomain) {
      updateOgUrl($, siteDomain + requestPath);
      // console.log('### og:url updated to ', siteDomain + requestPath);
    }
    if (requestPath.startsWith('/blog/')) {
      const content = await getContent('blog', requestPath);
      const data = content?.data();
      if (content && data) {
        if (data.ogImage) {
          updateOgImage($, data.ogImage);
          // console.log('### og:image updated to ', siteDomain + data.image);
        }
        if (data.title) {
          updateOgTitle($, data.title);
          // console.log('### og:title updated to ', data.title);
        }
        if (data.brief) {
          updateOgDescription($, data.brief);
          // console.log('### og:description updated to ', data.brief);
        }
      }
    } else if (requestPath.startsWith('/speakers/')) {
      const content = await getContent('speakers', requestPath);
      const data = content?.data();
      if (content && data) {
        if (data.photoUrl) {
          updateOgImage($, data.photoUrl);
          // console.log('### og:image updated to ', data.photoUrl);
        }
        if (data.name) {
          updateOgTitle($, `${data.name} - Speaker at GDG Pisa DevFest 2024`);
          // console.log(
          // '### og:title updated to ',
          // `${data.name} - Speaker at GDG Pisa DevFest 2024`
          // );
        }
        if (data.bio) {
          const shortBio = data.bio.slice(0, 200) + '...';
          updateOgDescription($, shortBio);
          // console.log('### og:description updated to ', shortBio);
        }
      }
    } else if (requestPath.startsWith('/sessions/')) {
      const content = await getContent('sessions', requestPath);
      const data = content?.data();
      if (content && data) {
        if (data.image) {
          updateOgImage($, data.image);
          // console.log('### og:image updated to ', data.image);
        }
        if (data.title) {
          updateOgTitle($, `${data.title} - Session at GDG Pisa DevFest 2024`);
          // console.log(
          // '### og:title updated to ',
          // `${data.title} - Session at GDG Pisa DevFest 2024`
          // );
        }
        if (data.description) {
          const shortDescription = data.description.slice(0, 200) + '...';
          updateOgDescription($, shortDescription);
          // console.log('### og:description updated to ', shortDescription);
        }
      }
    } else if (requestPath.startsWith('/schedule')) {
      updateOgTitle($, 'Schedule - GDG Pisa DevFest 2024');
      updateOgDescription($, 'Choose your sessions to visit at DevFest Pisa 2024');
    } else if (requestPath.startsWith('/team')) {
      updateOgTitle($, 'Team - GDG Pisa DevFest 2024');
      updateOgDescription($, 'Get more info about organizers');
    } else if (requestPath.startsWith('/location')) {
      updateOgTitle($, 'Location - GDG Pisa DevFest 2024');
      updateOgDescription($, 'Directions and address of the venue for DevFest Pisa 2024');
    } else if (requestPath.startsWith('/coc')) {
      updateOgTitle($, 'Code of Conduct - GDG Pisa DevFest 2024');
      updateOgDescription(
        $,
        'Learn more about our expectations for all those who participate in our community'
      );
    } else if (requestPath.startsWith('/faq')) {
      updateOgTitle($, 'FAQ - GDG Pisa DevFest 2024');
      updateOgDescription(
        $,
        'All the answers to the Frequently Asked Questions about DevFest Pisa 2024'
      );
    }

    res.send($.html());
  } else {
    // Here we return the minified HTML, as it will take care of the routing users that don't have a PWA installed.
    res.send(userFacingHtml);
  }
});

export const prerender = functions.https.onRequest(app);
