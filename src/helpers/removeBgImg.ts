async function removeBg(file: File) {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", file);
  
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": process.env.REMOVE_BG_KEY! },
      body: formData,
    });
  
    if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
    return await response.arrayBuffer();
  }
  
  export default removeBg;
  