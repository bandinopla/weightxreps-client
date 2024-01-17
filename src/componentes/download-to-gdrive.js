import { makeVar, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { AsciiSpinner } from "./ascii-spinner";
import { useGetSession } from "../session/session-handler";
import Alert from "@material-ui/lab/Alert";

const CLIENT_ID =
	"642401608663-tadlanaf1os1qvbp5vmbmkhlnt0hpq3g.apps.googleusercontent.com";

const readAccessToken = () => {
	const regex = /state=gdrive.*access_token=([^&]+)/;
	let m;
	if ((m = regex.exec(window.location.hash)) !== null) {
		return m[1];
	}
};

const sendToGoogleDrive = async (accessToken, filename, contents) => {
	var fileContent = contents; // As a sample, upload a text file.
	var file = new Blob([fileContent], { type: "text/plain" });
	var metadata = {
		name: filename, // Filename at Google Drive
		mimeType: "text/plain", // mimeType at Google Drive
		//'parents': ['weightxreps.net'], // Folder ID at Google Drive
	};

	var form = new FormData();
	form.append(
		"metadata",
		new Blob([JSON.stringify(metadata)], { type: "application/json" })
	);
	form.append("file", file);

	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open(
			"post",
			"https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id"
		);
		xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
		xhr.responseType = "json";
		xhr.onload = () => {
			if (xhr.response.error) {
				reject(xhr.response.error);
			} else {
				resolve(filename);
			}
		};
		xhr.onerror = (err) => {
			reject(err);
		};
		xhr.send(form);
	});
};

export const DownloadToGDrive = ({ selfFocus, txt, isFocused, close }) => {
	let token = readAccessToken();
	let [loading, setLoading] = useState();

	const { session } = useGetSession();
	const [data, setData] = useState();
	const [sent, setSent] = useState();
	const [error, setError] = useState(null);

	useEffect(() => {
		if (token && !isFocused) {
			selfFocus(false);
		}
	}, []);

	const onClose = () => {
		setSent(null);
		close();
	};

	if (loading) {
		if (data === true && txt) {
			setLoading(false);
		}

		return (
			<AsciiSpinner label={data === true ? "Packing your logs..." : loading} />
		);
	}

	if (sent === false) {
		return (
			<Alert severity="error" onClose={onClose}>
				{error}
			</Alert>
		);
	}

	if (sent) {
		return (
			<Alert onClose={onClose}>
				Logs uploaded to your Google Drive as {sent}
			</Alert>
		);
	}

	if (isFocused) {
		if (token) {
			if (txt) {
				setLoading("Sending to Google Drive...");

				setData(
					txt()
						.then((logsAsText) => {
							return sendToGoogleDrive(
								token,
								session.user.uname + "--logs.txt",
								logsAsText
							);
						})

						.then(
							(path) => { 
								setSent(path);
							},
							(e) => {
								setSent(false);
								setError(e.message);
							}
						)

						.finally(() => {
							setData(null);
							setLoading(false); 
						})
				);
			} else {
				setData(true);
				setLoading("Downloading your logs...");
				selfFocus(true); //<-- trigger download
			}
		} else {

            setLoading("Connecting to google...");
			window.open(
				`https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.file&response_type=token&state=gdrive&redirect_uri=${encodeURIComponent(
					window.location.origin + window.location.pathname
				)}&client_id=${CLIENT_ID}`,
				"_self"
			);
		}
	}

	return null;
};
