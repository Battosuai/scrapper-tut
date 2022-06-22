## For Scoop

Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

## Installing pscale cli

scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
scoop install pscale mysql

scoop update pscale

## For Running

pscale connect scrapper dev --execute 'npm run dev'

pscale connect scrapper dev --execute 'npm run seed:db'
