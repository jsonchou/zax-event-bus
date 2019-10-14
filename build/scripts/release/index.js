/*
 * @Author: jsonchou 
 * @Date: 2019-08-01 18:04:40 
 * @Last Modified by: jsonchou
 * @Last Modified time: 2019-08-01 18:45:33
 */
const path = require('path')
const doneRainbow = require('done-rainbow')
const execSync = require('child_process').execSync
const { version, innerModule } = require('../../../package.json')
const checkNpm = require('./checkNpm')

let increaseVersion = () => {
    let prefix = version.slice(0, version.lastIndexOf('.'))
    let suffix = version.slice(version.lastIndexOf('.') + 1)
    return prefix + '.' + (parseInt(suffix) + 1)
}

let doPublish = async () => {
    let safeNpm = checkNpm(innerModule)

    if (!safeNpm) {
        return
    }

    let version = increaseVersion()

    try {
        execSync(`npm run build`, { stdio: 'inherit' })
    } catch (err) {
        console.log('build', err)
        throw err
    }

    try {
        execSync(`git add .`, { stdio: 'inherit' })
        execSync(`git commit -am "release: v${version}"`, { stdio: 'inherit' })
        execSync(`git push`, { stdio: 'inherit' })
    } catch (err) {
        console.log('git', err)
        throw err
    }

    try {
        execSync(`npm version ${version} `, { stdio: 'inherit' })
        execSync(`npm publish`, { stdio: 'inherit' })
    } catch (err) {
        console.log('znpm', err)
        throw err
    }

    execSync(`git status`, { stdio: 'inherit' })
    execSync(`git push`, { stdio: 'inherit' })

    doneRainbow(`version ${version} published!`)
}

doPublish()
