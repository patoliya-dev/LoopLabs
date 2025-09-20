import ollama

def ask_model(prompt: str, model: str = "phi"):
    """
    Send a prompt to an Ollama model and return the response.

    Args:
        prompt (str): The user input to send to the model.
        model (str): The model name (default: 'phi').

    Returns:
        str: The model's response.
    """
    try:
        response = ollama.chat(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        # print(response)
        return response["message"]["content"]
    except Exception as e:
        return f"Error: {str(e)}"

# Example usage:
if __name__ == "__main__":
    reply = ask_model("Hello", model="phi")
    print("Model says:", reply)
