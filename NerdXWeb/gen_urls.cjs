const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lzteiewcvxoazqfxfjgg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6dGVpZXdjdnhvYXpxZnhmamdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTk0MTQxMiwiZXhwIjoyMDc3NTE3NDEyfQ.9mg_GmbkAO0ws6mhbCzCKErVhHS3n_BMSkkRjTmQOSI'
);

const videoPaths = [
  'History/Form3/Causes_of_the_Second_Chimurenga.mp4',
  'History/Form3/The_Early_Phase_of_the_Armed_Struggle_in_Zimbabwe_.mp4',
  'History/Form3/The_Second_Phase_of_the_Armed_Struggle_(Mobilisation_Phase)_in_.mp4',
  'History/Form3/The_Decisive_Phase__1972-79.mp4',
  'History/Form3/Zimbabwe_s_Liberation_Talks.mp4',
  'History/Form3/Zimbabwe_Since_1990.mp4',
  'History/Form3/Constitution.mp4',
  'History/Form3/Child_Rights_in_Zimbabwe.mp4',
  'History/Form3/Good_Governance_in_Zimbabwe.mp4',
  'History/Form3/Zimbabwe_on_the_Global_Stage.mp4',
  'History/Form3/Struggles_for_Freedom.mp4',
  'History/Form3/The_First_World_War.mp4',
  'History/Form3/Rise_of_European_Dictators.mp4',
  'History/Form3/Causes_of_WWII__ZIMSEC.mp4',
];

const audioPaths = [
  'History/Audios/Form3/Why_the_Second_Chimurenga_Became_Inevitable.m4a',
  'History/Audios/Form3/How_Failure_Forged_Zimbabwe_s_Liberation_Strategy.m4a',
  'History/Audios/Form3/Mass_Mobilization_in_Zimbabwe_s_Liberation_War.m4a',
  'History/Audios/Form3/The_Decisive_Phase_of_the_Second_Chimurenga.m4a',
  'History/Audios/Form3/From_Internal_Settlement_to_Lancaster_House.m4a',
  'History/Audios/Form3/How_1990_Reshaped_Zimbabwe.m4a',
  'History/Audios/Form3/Master_Zimbabwe_Governance_for_ZIMSEC_History.m4a',
  'History/Audios/Form3/Zimbabwe_s_Foreign_Policy_Alliances_and_Sanctions.m4a',
  'History/Audios/Form3/How_Mozambique_and_Namibia_Won_Independence.m4a',
  'History/Audios/Form3/The_Great_War_Causes_Course_and_Results.m4a',
  'History/Audios/Form3/The_Twenty_Year_Countdown_to_War.m4a',
  'History/Audios/Form3/The_League_of_Nations__Doomed_Experiment.m4a',
  'History/Audios/Form3/Iron,_Deception_And_Total_War_In_Zimbabwe.m4a',
];

async function main() {
  const expiresIn = 100 * 365 * 24 * 60 * 60; // 100 years
  const results = { videos: {}, audios: {} };

  for (const path of videoPaths) {
    const { data, error } = await supabase.storage.from('Video').createSignedUrl(path, expiresIn);
    results.videos[path] = data ? data.signedUrl : `ERROR: ${error?.message}`;
  }

  for (const path of audioPaths) {
    const { data, error } = await supabase.storage.from('Audio_Notes').createSignedUrl(path, expiresIn);
    results.audios[path] = data ? data.signedUrl : `ERROR: ${error?.message}`;
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
