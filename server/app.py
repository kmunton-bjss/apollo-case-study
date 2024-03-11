import os, sys
from flask import Flask, request, make_response
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv()

openai_endpoint = os.getenv("OPENAI_ENDPOINT")
openai_deployment = os.getenv("OPENAI_DEPLOYMENT")
client = AzureOpenAI(
    base_url=f"{openai_endpoint}/openai/deployments/{openai_deployment}/extensions",
    api_key=os.getenv("OPENAI_API_KEY"),
    api_version="2023-08-01-preview"
)

search_endpoint = os.getenv("AI_SEARCH_ENDPOINT")
search_key = os.getenv("AI_SEARCH_KEY")
search_index_name = os.getenv("AI_SEARCH_INDEX")

app = Flask(__name__)

@app.get("/")
def server():
    return "<p>server up</p>"

@app.get("/case-study")
def get_case_study():
    lens = request.args.get("lens")
    response = make_response(make_case_study(lens))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


def make_case_study(lens):
    completion = client.chat.completions.create(
        model=openai_deployment, # model = "deployment_name".
        messages=[
            {
                "role": "system", "content": f"You're an expert in the role of {lens}. " + 
                  "You are excellent at creating case studies that are structured with headings and multiple paragraphs. " +
                  "You are very knowledgeable about the Apollo program."
            },
            {
                "role": "user", "content": f"Tell me about the Apollo program from a {lens} point of view"
            },
        ],
        temperature=1,
        extra_body={
            "dataSources": [
              {
                  "type": "AzureCognitiveSearch",
                  "parameters": {
                      "endpoint": search_endpoint,
                      "key": search_key,
                      "indexName": search_index_name
                  }
              }
          ],
        },
    )
    return {"text": completion.choices[0].message.content}