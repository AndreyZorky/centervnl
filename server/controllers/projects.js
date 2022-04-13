const apiPartners = require('../api/controllers/partners')
const apiProjects = require('../api/controllers/projects')

module.exports.getProjectListPage = async function(req, res, data = {}) {
    try {
        const result = {...data}
        await apiPartners.getPartners(req, res, async (req, res, partners) => {
            result.partners = partners
            await apiProjects.getProjects(req, res, async (req, res, projects) => {
                result.projects = projects
                await apiProjects.getActive(req, res, async (req, res, nav_projects) => {
                    result.nav_projects = nav_projects
                    renderProjectListPage(req, res, result)
                })
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const renderProjectListPage = function(req, res, data) {
    res.render('projects-list', {
        title: 'Проекты',
        projects: data.projects,
        nav_projects: data.nav_projects,
        footer_logos: data.partners, 
        user: req.user
    })
}