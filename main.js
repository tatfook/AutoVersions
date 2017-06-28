var shell = require('shelljs');
var fs = require('fs');
var config = require('./defaultConfig');
var workspace_name = "workspace";
var assets_native_source = config.assets_native_source;
var assets_published_source = config.assets_published_source;
// root path
var root = shell.pwd().toString();

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

shell.cd(root + "/" + workspace_name);

function isExisted(url){
    var name = getGitName(url);
    var full_name = root + "/" + workspace_name + "/" + name
    console.log(full_name);
    return fs.existsSync(full_name);
}
function getGitName(url){
    var n = url.lastIndexOf("/");
    var s = url.substring(n+1);
    var arr = s.split(".");
    return arr[0];
}
function createOrUpdate(url)
{
    if(!url){
        return;
    }
    shell.cd(root);
    var name = getGitName(url);
    console.log(name);
    if(isExisted(url)){
        var full_name = root + "/" + workspace_name + "/" + name
        shell.cd(full_name);
        shell.exec("git pull");
    }else{
        shell.exec("git clone " + url);
    }
    shell.exec("git diff --name-only 8ec127c 6647c7a > my.patch");
    shell.cd(root);
}

createOrUpdate(assets_native_source);
createOrUpdate(assets_published_source);