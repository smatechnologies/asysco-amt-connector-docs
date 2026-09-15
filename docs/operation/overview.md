---
sidebar_label: 'Overview'
title: Operation overview
description: "Understand how to define and configure Asysco AMT jobs in OpCon and how the connector submits, monitors, and returns results."
tags:
  - Conceptual
  - Automation Engineer
  - Jobs
---

# Operation overview

## What is it?

The Operation section covers how to define Asysco AMT jobs in OpCon, how the connector submits and monitors those jobs in the AMT Batch environment, and how job results are returned to OpCon.

Use this section when you:

- Create OpCon job definitions that target the Asysco AMT Batch environment
- Modify existing AMT job definitions to change application names, parameters, or failure criteria
- Diagnose a failed job using the completion codes returned by the AMT environment

Two points are worth knowing:

- Job output from the AMT environment is automatically retrieved and attached to the OpCon job log, making it available through JORS without manual log collection
- AMT completion codes are surfaced as OpCon exit codes, allowing standard OpCon dependency and event logic to respond to AMT job outcomes

**Related topics:**

- [Asysco AMT job definitions](../operation.md)
