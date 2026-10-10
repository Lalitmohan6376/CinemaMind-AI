from transformers import pipeline


summarizer = pipeline(
    "summarization",
    model="Falconsai/text_summarization"
)


def summarize_overview(text):

    result = summarizer(
        text,
        max_length=80,
        min_length=20,
        do_sample=False
    )

    return result[0]["summary_text"]