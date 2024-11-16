# Welcome to Shield!

**Shield** has the ambitious goal of providing a strong layer of security against fraudulent or malicious intents in the Crypto world. It is strictly designed and built according to the principles of **privacy** and **security**. Through secure Machine Learning models, it parses in real time the user's navigation experience and promptly warns for potential Crypto-related scams. Furthermore, for any correct potential scam identification (and thus contribution to our scam dataset), our users will get rewarded with Shield's token.


# Architecture

Shield's architecture is build in different layers. The two core mechanisms behind its functioning are two, respectively:

- An **Optical Character Recognition** (OCR) ML model that runs locally, aiming at parsing the visual content the user is viewing on its monitor, and extracting readable text from it. This model will run locally and we can define as being *secure by locality*.
- A **classification LLM**, an architecture that we fine-tuned with crypto scams datasets and modified to output a probability (of the text being fraudulent) instead of natural language. This will be instead *secure by proof, through a deployment in a Trusted Execution Environment (TEE)* on Phala Network.

Additionally, Shield comes equipped with all the connections to make its different part work together (mostly REST infrastructures), a Frontend to interact with it, and all the tools to trigger another fine tuning of the model for further future enhancements.



## Technologies

This project is mostly built on Open Source technologies, but technology from private Companies has been used (Privy, Hyperbolic, Phala Network).
