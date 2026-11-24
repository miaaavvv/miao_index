// The first complete lake uses small versions of the same 3D cloud fields.
// Full-resolution weather is optional and must never delay the entrance.
export const startupClouds = {
  density: { url: '/_p/lake-startup/cloud-density-64x64x16.rg8', size: [64, 64, 16], channels: 2 },
  volume: { url: '/_p/lake-startup/cloud-volume-32x32x32.rgba8', size: [32, 32, 32], channels: 4 },
};

export async function loadLakeClouds(gl, { densityUrl, volumeUrl, mobile = false, detailed = false } = {}) {
  const density = detailed
    ? { url: densityUrl, size: mobile ? [256, 256, 64] : [480, 480, 80], channels: 2 }
    : startupClouds.density;
  const volume = detailed
    ? { url: volumeUrl, size: [128, 128, 128], channels: 4 }
    : startupClouds.volume;
  const fields = [density, volume];
  const buffers = await Promise.all(fields.map(async field => {
    const response = await fetch(field.url, { priority: detailed ? 'low' : 'high' });
    if (!response.ok) throw new Error('Cloud field unavailable');
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength !== field.size.reduce((a, b) => a * b, field.channels)) {
      throw new Error('Cloud field has invalid dimensions');
    }
    return new Uint8Array(buffer);
  }));
  if (gl.isContextLost()) throw new Error('Cloud upload interrupted');
  // Previous rendering errors do not belong to this optional upload. Drain the
  // finite WebGL error flags, but stop if a broken context keeps returning one.
  let clean = false;
  for (let count = 0; count < 16; count++) {
    if (gl.isContextLost()) throw new Error('Cloud upload interrupted');
    if (gl.getError() === gl.NO_ERROR) { clean = true; break; }
  }
  if (!clean) throw new Error('Cloud upload error state unavailable');
  const checkUpload = () => {
    if (gl.isContextLost()) throw new Error('Cloud upload interrupted');
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Cloud texture upload failed');
  };
  const textures = [];
  try {
    for (let index = 0; index < fields.length; index++) {
      if (gl.isContextLost()) throw new Error('Cloud upload interrupted');
      const field = fields[index];
      const texture = gl.createTexture();
      if (!texture) throw new Error('Cloud texture unavailable');
      textures.push(texture);
      gl.bindTexture(gl.TEXTURE_3D, texture);
      gl.texImage3D(gl.TEXTURE_3D, 0, field.channels === 2 ? gl.RG8 : gl.RGBA8,
        ...field.size, 0, field.channels === 2 ? gl.RG : gl.RGBA, gl.UNSIGNED_BYTE, buffers[index]);
      checkUpload();
      gl.generateMipmap(gl.TEXTURE_3D);
      checkUpload();
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, index === 0 ? gl.CLAMP_TO_EDGE : gl.REPEAT);
      checkUpload();
    }
    if (gl.isContextLost()) throw new Error('Cloud upload interrupted');
    return { density: textures[0], volume: textures[1] };
  } catch (error) {
    for (const texture of textures) gl.deleteTexture(texture);
    throw error;
  }
}
