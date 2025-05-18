const fs = require("node:fs");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

app.get("/video", (req, res) => {
	const range = req.headers.range;
	if (!range) {
		return res.status(400).send("Requires Range header");
	}

	const videoPath = "abc.mp4"; // put video.mp4 here
	const videoSize = fs.statSync(videoPath).size;

	const chunkSize = 10 ** 6;
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + chunkSize, videoSize - 1);

	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};

	res.writeHead(206, headers);

	const stream = fs.createReadStream(videoPath, { start, end });

	stream.pipe(res);
});

const PORT = 8080;

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
