import os
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL_NAME = "Falconsai/text_summarization"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)


def summarize_overview(text):
    text = str(text).strip()
    if not text:
        return ""

    inputs = tokenizer(
        text,
        return_tensors="pt",
        max_length=512,
        truncation=True
    )

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=80,
            min_length=20,
            do_sample=False
        )

    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return summary
