import os, sys
from flask import Flask, request, make_response
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv()

openai_endpoint = os.getenv("OPENAI_ENDPOINT")
openai_deployment = os.getenv("OPENAI_DEPLOYMENT")
clientWithExtension = AzureOpenAI(
    base_url=f"{openai_endpoint}/openai/deployments/{openai_deployment}/extensions",
    api_key=os.getenv("OPENAI_API_KEY"),
    api_version="2023-08-01-preview"
)

client = AzureOpenAI(
    azure_endpoint=openai_endpoint,
    api_key=os.getenv("OPENAI_API_KEY"),
    api_version="2023-08-01-preview"
)

search_endpoint = os.getenv("AI_SEARCH_ENDPOINT")
search_key = os.getenv("AI_SEARCH_KEY")
search_index_name = os.getenv("AI_SEARCH_INDEX")

questions = {
    "goal": {
      "software / hardware engineering": "What we're the scientific, software and hardware engineering objectives in the Apollo program?",
      "project management": "What we're the project management objectives in the Apollo program?",
      "general management": "What we're the general objectives in the Apollo program?",
      "finance / financial controller": "What were the financial objectives of the Apollo program? Any budgets?"
    },
    "solution": {
      "software / hardware engineering": "What technology both software and hardware were used in the Apollo program?" + 
          " What was the science behind thd Apollo program?" +
          " Were there any scientific, software or hardware hurdles that were overcome? If so how were they overcome?",
      "project management": "How was the Apollo project planned?" +
          " How was the Apollo project organized and executed?" +
          " How was the Apollo project monitored and controlled?",
      "general management": "What was the structure of the Apollo program?" +
          "What kinds of resources were needed in the Apollo program?" +
          " How were the day to day operations of the Apollo program handled?" +
          " How were the costs and revenue handled in the Apollo program?" +
          " How was the marketing and PR tasks handled in the Apollo program?" +
          " Who were the Apollo competitors?" +
          " How were the general hurdles of moon landing overcome?",
      "finance / financial controller": "How much did the Apollo program cost in total?" +
          " Where did the funding for the Apollo program come from?" +
          " What was the breakdown of the costs for the Apollo program?" +
          " What was the most expensive  and least expensive part of the program?"
    },
    "result": {
      "software / hardware engineering": "Did they overcome the software, hardware and scientific challenges and was the Apollo program success? Why?",
      "project management": "Did they overcome the project management challenges and was the Apollo program a success? Why?",
      "general management": "Was the Apollo program a success generally? Explain why?",
      "finance / financial controller": "Did they meet the financial goals of the Apollo program or was it over the budget? Why?"
    }
}

app = Flask(__name__)

@app.get("/")
def server():
    return "<p>server up</p>"

@app.get("/case-study")
def get_case_study():
    lens = request.args.get("lens")
    return get_response(make_case_study(lens.lower()))

@app.post("/analyse")
def analyse_case_study():
    case_study = request.get_json(force=True)["caseStudy"]
    completion = client.chat.completions.create(
        model=openai_deployment, # model = "deployment_name".
        messages=[
            {
                "role": "system", "content": "You are great at identifying the audience and roles a piece of text is intended for"
            },
            {
                "role": "user", "content": f"Identify the role this case study is intended for. Case study: {case_study}"
            },
        ]
    )

    return get_response({"role": completion.choices[0].message.content})


def get_response(data):
    response = make_response(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

def make_case_study(lens):
    result = {
        "introduction": get_openai_response_using_own_data("Write a concise introduction about the Apollo program", detail=False),
        "goal": get_openai_response_using_own_data(questions["goal"][lens] + " Only state the objectives, not how it was achieved."),
        "solution":  get_openai_response_using_own_data(questions["solution"][lens]),
        "conclusion":  get_openai_response_using_own_data(questions["result"][lens])  
    }

    return result

def get_openai_response_using_own_data(prompt, detail=True):
    detail_prompt = " Go into detail and specifics."
    completion = clientWithExtension.chat.completions.create(
        model=openai_deployment, # model = "deployment_name".
        messages=[
            {
                "role": "system", "content": "You are an informative assistant that is very knowledgeable about the Apollo program."
            },
            {
                "role": "user", "content": f"{prompt}{detail_prompt if detail else None}"
            },
        ],
        temperature=0.5,
        extra_body={
            "dataSources": [
              {
                  "type": "AzureCognitiveSearch",
                  "parameters": {
                      "endpoint": search_endpoint,
                      "key": search_key,
                      "indexName": search_index_name,
                      "roleInformation": "You are given data about the Apollo program. Read them carefully and answer the queries.",
                      "topNDocuments": 10 # Default is 5, but the pdf documents have been broken up into individual pages so increased this value
                  },
              }
          ],
        },
    )
    return completion.choices[0].message.content