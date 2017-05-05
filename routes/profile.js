var express = require('express');
var router = express.Router();
// Load the full build. 
var _ = require('lodash');
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
var PersonalityTextSummaries = require('personality-text-summary');


router.post('/', function (req, res) {

  var personality_insights = new PersonalityInsightsV3({
    username: process.env.PERSONALITY_INSIGHTS_USERNAME,
    password: process.env.PERSONALITY_INSIGHTS_PASSWORD,
    version_date: '2016-10-20'
  });

  var params = {
    text: req.body.aboutyou,
    consumption_preferences: true,
    raw_scores: true,
    headers: {
      'accept-language': 'en'
    }
  };

  //Call to the personality insights service to get the profile
  personality_insights.profile(params, function (error, response) {
    if (error)
      console.log('Error:', error);
    else
   
    //get the personality summary
      var v3EnglishTextSummaries = new PersonalityTextSummaries({
        locale: 'en',
        version: 'v3'
      });    
    var profilesummary = v3EnglishTextSummaries.getSummary(response);

    // get the values
    var values = response.values;

    //get the needs
    var needs = response.needs;

    //get the personality
    var personality = response.personality;

    for (const person of personality) {
      console.log(person.children);
    }

    var preferences = response.consumption_preferences;



    var likelypreference =[];
    var unlikelypreference =[];
    for (const preference of preferences) {

      var newpreferences =preference.consumption_preferences;
      for (const specificpreference of newpreferences) {
        if(specificpreference.score === 1) {
          likelypreference.push(specificpreference.name);
        }
        else if(specificpreference.score === 0 ) {
          unlikelypreference.push(specificpreference.name);
        }
      }
     }


    res.render('profile', {
      title: 'Investment Advisor',
      profilesummary: profilesummary,
      pageheading: "Your Personality Summary",
      preferencesheading: "Your Preferences",
      preferences: preferences,
      values: values,
      personality: personality,
      needs: needs,
      likelypreference: likelypreference,
      unlikelypreference: unlikelypreference
    });
  });

});


module.exports = router;