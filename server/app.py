import os, sys
from flask import Flask, request, make_response
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv()

client = AzureOpenAI(
    azure_endpoint=os.getenv("OPENAI_ENDPOINT"),
    api_key=os.getenv("OPENAI_API_KEY"),
    api_version="2024-02-15-preview"
)

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
        model="chat-test", # model = "deployment_name".
        messages=[
            {
                "role": "system", "content": f"You're an expert in the role of {lens}"
            },
            {
                "role": "user", "content": f"Tell me about the role {lens} in one sentence"
            },
        ]
    )
    return {"text": completion.choices[0].message.content}