# Apollo Case Study

## NextJS UI - Frontend

- Node version 18.19.0 or higher

### Run the following from root

```bash
npm install
npm run dev
```

## Python Flask Server - Backend

- Python 3.11
- `.env` file with the following environment variables set:

```txt
OPENAI_API_KEY=
OPENAI_ENDPOINT=
OPENAI_DEPLOYMENT=
AI_SEARCH_ENDPOINT=
AI_SEARCH_KEY=
AI_SEARCH_INDEX=
```

### Run the following from `server` directory

```bash
pip3.11 install -r requirements.txt
flask run
```

## Other information

In Azure the following resources need to be set up:

- Azure OpenAI
- Azure Storage Account, with data files uploaded to the container (Azure Blob Storage)
- Azure AI Search - standard pricing (allows 4 million characters to be indexed per document in Blob storage)
- Azure AI Services (multi account, same region as Azure AI Search)


## Troubleshooting

- If getting 401 error, double check the API key is not already set on the terminal you are running the Flask server from. Use the `unset` command.

