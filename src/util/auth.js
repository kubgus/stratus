const session_bearer_tokens = new Map();

export function add_session_token(data) {
    session_bearer_tokens.set(data.session.access_token, data.user.id);
}

export function is_valid_token(token) {
    return session_bearer_tokens.has(token);
}

export function get_user_id(token) {
    if (!is_valid_token(token)) {
        return null;
    }
    return session_bearer_tokens.get(token) ?? null;
}

export function remove_session_token(token) {
    session_bearer_tokens.delete(token);
}

export function clear_session_tokens() {
    session_bearer_tokens.clear();
}
