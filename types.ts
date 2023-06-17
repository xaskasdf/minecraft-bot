export interface Something {
    id: string,
    object: string,
    created: number,
    mode: string,
    choices: Array<Choice>,
}

export interface Choice {
    text: string,
    index: number,
    logprobs: any,
    finish_reason: string
}

export interface GPTRequest {
    prompt: string,
    max_tokens: number,
    temperature: number,
    stop: string,
    n: number
}