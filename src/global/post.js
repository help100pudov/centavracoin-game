import axios from "axios";
import store from "../store";

// const baseUrl = `http://${window.location.hostname}:3002/api`;
const baseUrl = "https://" + window.location.hostname + "/api";

export async function post(event, param = {}) {
    let url,
        sendData,
        submitBtn,
        headers = {};
    let token = store.getters.user.token || "";

    try {
        if (param == "file" || param == "submit") {
            event.preventDefault();
            const form = event.target.closest("form");
            if (!form) return;
            const formData = new FormData(form);
            if (token) formData.append("token", token);
            if (param == "submit") {
                sendData = {};
                formData.forEach((value, key) => {
                    sendData[key] = value;
                });
                headers["Content-Type"] = "application/json";
            } else {
                sendData = formData;
                headers["Content-Type"] = "multipart/form-data";
            }

            submitBtn = form.querySelector("[type=submit]");
            if (submitBtn) {
                submitBtn.disabled = true;
            }

            url = form.id;
        } else {
            url = event;
            param.token = token;
            sendData = JSON.stringify(param);
            headers["Content-Type"] = "application/json";
        }

        const response = await axios.post(`${baseUrl}${url}`, sendData, {headers});

        if (submitBtn?.disabled) submitBtn.disabled = false;

        return response.data;
    } catch (error) {
        if (submitBtn?.disabled) submitBtn.disabled = false;
    }
}
