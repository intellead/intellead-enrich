<h1>Welcome to Intellead Enrich documentation!</h1>
Intellead Enrich aims to be an easy way to enrich information about leads.

<h3>Contents</h3>
<ul>
  <li>Introduction</li>
    <ul>
      <li>Features</li>
    </ul>
  <li>Instalation
    <ul>
      <li>Dependencies</li>
      <li>Get a copy</li>
    </ul>
  </li>
  <li>Configuration
  <li>Use Cases
  </li>
  <li>Copyrights and Licence</li>
</ul>
<h3>Introduction</h3>
Intellead Enrich has as goal, to centralize call of the services of enrichment.
<h4>Features</h4>
This application provides lead enrichment and lead enrichment schedule.
<h3>Instalation</h3>
intellead-enrich is a very smaller component that provide a simple way to centralize services of enrichment of leads of intellead.
This way you do not need to install any other components for this to work.
<h4>Dependencies</h4>
This application depends on the following services:<br>
intellead-data (provides information of the leads to be enriched and persists new information)<br>
receitaws-data (provides company information of the lead through cnpj)<br>
qcnpj-crawler (provide lead company information by company name)<br>
intellead-classification (after all the enrichment services finish processing, this service is called to classify the lead)
<h4>Get a copy</h4>
I like to encourage you to contribute to the repository.<br>
This should be as easy as possible for you but there are few things to consider when contributing. The following guidelines for contribution should be followed if you want to submit a pull request.
<ul>
  <li>You need a GitHub account</li>
  <li>Submit an issue ticket for your issue if there is no one yet.</li>
  <li>If you are able and want to fix this, fork the repository on GitHub</li>
  <li>Make commits of logical units and describe them properly.</li>
  <li>If possible, submit tests to your patch / new feature so it can be tested easily.</li>
  <li>Assure nothing is broken by running all the tests.</li>
  <li>Open a pull request to the original repository and choose the right original branch you want to patch.</li>
  <li>Even if you have write access to the repository, do not directly push or merge pull-requests. Let another team member review your pull request and approve.</li>
</ul>
<h3>Configuration</h3>
Once the application is installed (check Installation) define the following settings to enable the application behavior.
<h4>Config vars</h4>
The application uses other intellead services.<br>
For this it is necessary to configure the URL variables.<br>
You must config the following vars:<br>
DATA_LEAD_INFO_URL - Full URL of Lead Info API from Data Service;<br>
QCNPJ_CRAWLER_URL - Full URL of QCNPJ API from QCNPJ Crawler Service;<br>
DATA_UPDATE_ENRICHED_LEAD_INFO_URL - Full URL of Update Enriched Lead Information API from Data Service;<br>
RECEITAWS_DATA_URL - Full URL of ReceitaWS API from ReceitaWS Service;<br>
CLASSIFICATION_URL - Full URL of Classification Service;<br>
DATA_UPDATE_ENRICH_ATTEMPTS_URL - Full URL of Update Enrich Attempts of Data Service.<br>
<h3>Copyrights and Licence</h3>
TO DO
