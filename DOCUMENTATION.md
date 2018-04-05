# Welcome to Intellead Enrich documentation!

Intellead Enrich aims to be an easy way to enrich information about leads.

## Contents
  * Introduction
    * Features
  * Instalation
    * Dependencies
    * Get a copy
  * Configuration
    * Config vars
  * Use Cases
  * Copyrights and Licence

## Introduction
Intellead Enrich has as goal, to centralize call of the services of enrichment.

#### Features
This application provides lead enrichment and lead enrichment schedule.

## Instalation
intellead-enrich is a very smaller component that provide a simple way to centralize services of enrichment of leads of intellead.
This way you do not need to install any other components for this to work.

#### Dependencies
This application depends on the following services:  
intellead-security (provides authentication and authorization)  
intellead-data (provides information of the leads to be enriched and persists new information)  
receitaws-data (provides company information of the lead through cnpj)  
qcnpj-crawler (provide lead company information by company name)  
intellead-classification (after all the enrichment services finish processing, this service is called to classify the lead)

#### Get a copy
I like to encourage you to contribute to the repository.
This should be as easy as possible for you but there are few things to consider when contributing. The following guidelines for contribution should be followed if you want to submit a pull request.
  * You need a GitHub account.
  * Submit an issue ticket for your issue if there is no one yet.
  * If you are able and want to fix this, fork the repository on GitHub.
  * Make commits of logical units and describe them properly.
  * If possible, submit tests to your patch / new feature so it can be tested easily.
  * Assure nothing is broken by running all the tests.
  * Open a pull request to the original repository and choose the right original branch you want to patch.
  * Even if you have write access to the repository, do not directly push or merge pull-requests. Let another team member review your pull request and approve.

## Configuration
Once the application is installed (check Installation) define the following settings to enable the application behavior.

#### Config vars
The application uses other intellead services.  
For this it is necessary to configure the URL variables.  
You must config the following vars:  
  * SECURITY_URL - Full URL to intellead-security auth endpoint (`http://intellead-security/auth`);
  * QCNPJ_CRAWLER_URL - Full URL of QCNPJ API from QCNPJ Crawler Service (`http://qcnpj-crawler`);
  * DATA_UPDATE_ENRICHED_LEAD_INFO_URL - Full URL of Update Enriched Lead Information API from Data Service (`http://intellead-data/update-enriched-lead-information`);
  * RECEITAWS_DATA_URL - Full URL of ReceitaWS API from ReceitaWS Service (`http://receitaws-data`);
  * CLASSIFICATION_URL - Full URL of Classification Service (`http://intellead-classification/lead_status_by_id`);
  * DATA_UPDATE_ENRICH_ATTEMPTS_URL - Full URL of Update Enrich Attempts of Data Service (`http://intellead-data/update-enrich-attempts`).

## Copyrights and Licence
Project copyright and license is available at [LICENSE](./LICENSE).
