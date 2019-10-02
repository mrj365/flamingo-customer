// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,
  settingsLocation: '/static/app-dev.json',
  platformName: 'Flamingo Shore',
  platformNameShort: 'FS',
  serviceProviderName: 'Service Provider',
  serviceProviderNamePlural: 'Service Providers',
  serviceAreas: ['Aleppo', 'Aspinwall', 'Avalon', 'Baldwin', 'Bellevue', 'Ben Avon', 'Bethel Park', 'Blawnox', 
    'Bradford Woods', 'Bridgeville', 'Carnegie', 'Castle Shannon', 'Cheswick', 'Churchill', 'Collier', 'Coraopolis', 
    'Crafton', 'Crescent', 'Dormont', 'East Deer', 'Edgeworth', 'Emsworth', 'Findlay', 'Fox Chapel', 'Franklin Park', 
    'Glen Osborne', 'Greentree', 'Hampton', 'Harmar', 'Haysville', 'Heidelberg', 'Ingram', 'Kennedy', 'Kilbuck', 'Leet', 
    'Leetsdale', 'Marshall', 'McCandless', 'McDonald', 'McKees Rocks', 'Monroeville', 'Moon', 'Mt. Lebanon', 'Neville', 
    'North Fayette', 'Oakdale', 'Oakmont', 'O’Hara', 'Ohio', 'Penn Hills', 'Pennsbury Village', 'Pine', 'Pittsburgh', 
    'Plum', 'Richland', 'Robinson', 'Ross', 'Rosslyn Farms', 'Scott', 'Sewickley', 'Shaler', 'Sharpsburg', 'South Fayette', 
    'Springsdale', 'Stowe', 'Thornburg', 'Upper St. Clair'],
  selectStaffEnabled: true,

  googleClientId: '527177110985-c3ujp7pqg1a0k35c4bnjc6kk6atfpqsj.apps.googleusercontent.com',
  // staticImgPath: 'https://1383497662.rsc.cdn77.org/laundry/',
  // termsUrl: 'https://1383497662.rsc.cdn77.org/laundry/sitedocs/terms.htm',
  // privacyUrl: 'https://1383497662.rsc.cdn77.org/laundry/sitedocs/privacy.htm',
  staticImgPath: 'https://1297557073.rsc.cdn77.org/laundry-dev/',
  termsUrl: 'https://1297557073.rsc.cdn77.org/laundry-dev/sitedocs/terms.htm',
  privacyUrl: 'https://1297557073.rsc.cdn77.org/laundry-dev/sitedocs/privacy.htm',
  faqUrl: 'https://1297557073.rsc.cdn77.org/laundry-dev/sitedocs/faq.htm',
  stripePublicApiKey: 'pk_test_q9naYDax6QcdjBPswBic3pZj',
  googleApiKey: 'AIzaSyCkUUe-D8acqN9y2D1CpWlhFf1AykFPWjE',
  fbAppId: '918143571673307',
  sentryAPIKey: 'https://c99e9a45bce348db8422840fecb8010c@sentry.io/1445210',
  fbSocialUrl: 'https://www.facebook.com/FlamingoShoreDev/',
  showFbSocial: true,
  twitterSocialUrl: '',
  showTwitterSocial: false,
  linkedInSocialUrl: '',
  showLinkedInSocial: false,
  instagramSocialUrl: 'https://www.instagram.com/flamingoshore/',
  showInstagramSocial: true,
  appFavicon: 'flamingo-shore.ico',
  hailProfile: false,
  pickupProfile: true,
  enableTimeSelection: false
};
