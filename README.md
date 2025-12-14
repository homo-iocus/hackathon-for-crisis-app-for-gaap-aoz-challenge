# 🏗️ SupplyHub

**SupplyHub** is a centralized crisis management platform designed to streamline the **distribution of goods and resources** during emergencies and humanitarian crises.
Built at a UZH seminar hackathon, SupplyHub connects **crisis management team (Kriesenstab)** with other **government agencies** to ensure that help reaches where it’s needed most — efficiently and transparently.

---

## 🌍 Problem Statement

During crises such as natural disasters, pandemics, or conflicts, **supply chain coordination** often breaks down.
Relief organizations struggle with:

- Lack of visibility into **available resources** and **current needs**
- **Inefficient communication** between multiple stakeholders
- **Duplicate efforts** and **delayed aid delivery**

**SupplyHub** addresses these issues by providing a unified, data-driven platform for real-time coordination.

---

---

## 🚀 Features

- **🗺️ Centralized Dashboard:** Visualize supply and demand in real time.
- **🤝 Request Ticket System:** Approve requests made by crisis management as the authorization entity.
- **📦 Inventory Tracking:** Manage stock levels and monitor incoming/outgoing shipments.
- **🌐 Multi-role Access:** Separate dashboards for crisis management team, logistics teams, and administrators.

---

## Screenshots

![dashboard](doc/dashboard_crisis_management.png)
![inventory overview](doc/central_overview.png)
![request detail](doc/request-detail.png)
![request form](doc/request-form.png)
![local overview](doc/local_overview.png)
![roles](doc/roles_overview.png)

## 🧠 Tech Stack

| Category      | Technology        |
| ------------- | ----------------- |
| **Prototype** | React.js + Python |

## AI Usage during the development phase

The group used AI to generate both the HTML elements and the underlying data structures required for display. An exemplary workflow for creating a single React component with AI proceeded as follows:

1. They prompted an LLM to propose a JSON data structure for the specific use case.

2. They refined the generated data structure through iterative prompting.

3. They requested the LLM to generate React components using the MUI library to render the data.

4. They visualized the generated code in the local environment and further refined it in collaboration with the LLM.

5. They manually integrated the finalized component into the existing project scaffold.

This workflow was repeated multiple times for most of the different components.
The final integration and validation of the single components remained manual to ensure architectural coherence and reliability.

Overall AI was helpful by providing boilerplate code and generating self contained components. It was most effective for the group when used to solve clearly defined sub-tasks quickly. For example, it helped the group to generate JSON data structures, MUI-based React components, and user interface layouts very rapidly, and it was useful for solving coding errors, such as missing imports or merge conflicts.

We also encountered some clear limitations when using AI assistance. AI struggled when asked to fulfill more complex tasks, such as handling application state or backend logic, and often hallucinated structures, which were not aligned with the actual architecture of the group. Moreover, small code changes using AI led to large, unintended code adjustments. Therefore, manually adjusting these parts was often faster and safer.

## 👥 Team & Responsibilities

- **Daniel Maksimovic**  
  Solution: Daniel was responsible for implementing the crisis management dashboard, where the crisis management team can
  view specific categories of items and the list of pending requests, which displays the current status of the requests.
  Additionally, Daniel implemented the functionality that when the crisis management team clicks on a specific category, the
  items under this category are displayed on a new page. The request item page, where the crisis management team can
  request items, was also a responsibility of Daniel.

  Report: Daniel was responsible for the sections 4.1 Partner/User Interview Results, 4.3 Peer Interview
  Results, 6. Reflections, and Appendix B.

- **Katerina Kuneva**  
  Soltion: Katerina was responsible for the organization dashboard, where the inventory is managed and all the goods in the
  inventory can be viewed.

  Report: Katerina was responsible for the abstract and for the sections 1. Problem and Motivation, 2. Solution
  Design and Fit to the GaaP Concept, 7. Conclusions, and Appendix A.

- **Nils Grob**  
  Solution: Nils implemented the dashboard of the authorization role, where the requests from the crisis management team
  can be authorized, partially authorized, or declined.

  Report: Nils was responsible for the sections 3. Approach, 4.2 Incident Catalogue, and 5. Analysis.

Effort and responsibility during the hackathon were divided equally among all team members.
The same goes for the written report.

## Demo video

The demo video can be found on [Sharepoint](https://uzh.sharepoint.com/:v:/s/SeminarDigitalPlatformsforResilience/IQBkA8X2akPJSJEei-a929D_AQP6QWgcHqhqiA8tU2JkvmQ?e=JRtKYx)
