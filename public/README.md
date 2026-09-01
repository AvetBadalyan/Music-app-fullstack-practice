Vercel expects a static output directory after the build step runs.
This API serves no static files - every path is rewritten to the serverless
function in api/. This placeholder keeps the directory empty and present.
