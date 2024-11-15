---
title: "Patient No-Show Prediction: Improving Operating Room Utilization in a Major Academic Medical Center"
slug: "case-study-patient-no-show-prediction"
date: 2024-11-15
tags:
- AI
- ML
- case study
- healthcare
thumbnail: /images/irwan-rbDE93-0hHs-unsplash.jpg
type: page
---

## Executive Summary

A major academic medical center faced challenges with high patient no-show rates for scheduled surgical procedures, leading to suboptimal utilization of limited operating room capacity and lost revenue opportunities. To address this problem, I was contracted to develop a machine learning model to predict the likelihood of patient no-shows. By integrating this predictive capability into their scheduling workflows, the hospital was able to proactively identify high-risk no-show patients and take steps to mitigate the issue.

## Problem Statement

Operating room scheduling slots are a scarce and valuable resource for hospitals. Patient no-shows significantly impact a hospital's ability to efficiently utilize this capacity and perform the maximum number of procedures. By accurately forecasting which patients were likely to be no-shows, the hospital aimed to take proactive measures to either increase the likelihood of those patients attending or quickly reschedule the slot with another patient.

## Data and Modeling Approach

I leveraged both structured and unstructured patient data to train the no-show prediction model:

* **Structured data:** Historical attendance records, demographics, and other quantitative patient attributes
* **Unstructured data:** Doctor's notes and other free-text medical history information, analyzed using natural language processing (NLP) techniques

Due to the lack of large language models at the time, I employed classical machine learning methods like word embeddings and neural networks to extract meaningful insights from the unstructured clinical notes.

## Deployment and Integration

The no-show prediction model was integrated into a custom scheduling tool used by the hospital's administrative staff. This tool guided the scheduling process, ensuring all required information was collected. It then accessed the patient's medical record, generated a no-show likelihood prediction, and surfaced this information to the staff. Armed with this data, they could apply appropriate interventions to high-risk patients to increase the likelihood of attendance.

## Key Learnings

The primary challenge was ensuring the accuracy and reliability of the historical data used to train the model. The hospital's electronic health record (EHR) system contained discrepancies, requiring extensive collaboration with doctors, administrators, and IT to reconcile and establish a validated dataset representing the true "ground truth" of past no-show outcomes. This highlighted the critical importance of data quality and validation when deploying predictive models in complex healthcare environments.

## Conclusion

By developing and deploying a machine learning model to predict patient no-shows, the hospital was able to proactively manage its operating room scheduling and improve overall utilization of this limited resource. While the full impact could not be quantified due to the onset of the COVID-19 pandemic, the potential benefits included higher procedure volumes, better patient outcomes, and increased revenue for the organization. The key lesson was the necessity of meticulous data preparation when implementing predictive capabilities in a healthcare setting.