# Parlivo offline translation models

Translation models used by the Parlivo web app, downloaded once by the app and then used offline.

They are Mozilla's Firefox Translations models (Bergamot / Marian), unchanged apart from gzip
compression, from Firefox's public model service. License: MPL-2.0 — see https://github.com/mozilla/translations.

`registry.json` lists every language pair, its files, their sizes and SHA-256 hashes (of the uncompressed files).
