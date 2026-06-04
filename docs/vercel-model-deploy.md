# Vercel 3D Model Deploy Notes

The production source tree must not contain one `.glb` file over 100 MB. GitHub rejects files over 100 MB and Vercel Hobby source uploads also cap individual files at 100 MB.

Current setup:

- The original local model stays at `public/models/gobeyond-operations-diorama-v3.web.glb`.
- That full file is ignored by Git and Vercel.
- The deployable fallback uses committed chunks:
  - `public/models/gobeyond-operations-diorama-v3.web.glb.part-00`
  - `public/models/gobeyond-operations-diorama-v3.web.glb.part-01`
- `components/GobeModel.tsx` fetches the chunks, joins them into a browser `Blob`, and loads the original model from that Blob URL.

Preferred CDN path:

1. Upload the full original `.glb` to Vercel Blob, Cloudflare R2, S3, or another public CDN with CORS enabled.
2. Set `NEXT_PUBLIC_GOBE_MODEL_URL` in Vercel Production/Preview to the public model URL.
3. Deploy normally. When the env var exists, the app loads the external URL instead of chunking local files.

Vercel Blob command after the project has a connected Blob store or a `BLOB_READ_WRITE_TOKEN`:

```bash
npx vercel blob put public/models/gobeyond-operations-diorama-v3.web.glb \
  --access public \
  --multipart true \
  --pathname models/gobeyond-operations-diorama-v3.web.glb \
  --content-type model/gltf-binary \
  --cache-control-max-age 31536000
```
