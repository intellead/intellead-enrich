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
    <ul>
      <li>Enrich leads</li>
      <li>Lead enrichment scheduling</li>
    </ul>
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
qcnpj-crawler (provide lead company information by company name)
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
Once the application is installed (check Installation) is not need define others settings. 
<h3>Use Cases</h3>
Some use cases for intellead-enrich.
<h4>Enrich lead</h4>
This application provides a service to enrich a lead by id.
We can call the API like this:

```javascript

var lead_id = $('#lead_id').val();
$.ajax({
    "crossDomain": true,
    "url": https://your_domain.com/lead-enrichment-by-id,
    "method": "POST",
    "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
    },
    "data": {
        lead_id : lead_id
    },
})

```

<h4>Lead enrichment scheduling</h4>
intellead-enrich uses node-schedule to automate the enrichment service.
Each 5 minutes intellead-enrich ask to intellead-data if exists leads not enriched, if it exists, it will enrich these.
Each enriched service has a signature (which is the name of the service) that marks the lead if it has already been enriched by the service, if so, the lead is ignored and no longer needs to be enriched by it.
If any service can not enrich the lead, it uses this signature to mark how many times it has tried to enrich the lead.
Each service has a limit of 2 enrichment attempts per lead.
The lead that is not enriched up to 2 times, should wait for a new lead conversion to try again.

<h3>Copyrights and Licence</h3>
TO DO
