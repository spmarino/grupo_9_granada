
const db = require('../database/models');
const { Op } = require('sequelize');
const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const message = require('../database/models/message');




const adminController = {
    'productLoad': function (req, res) {
        db.ProductsCategories.findAll()
            .then(categories => {
                return res.render('Admin/productLoad', {
                    categories
                })
            })
            .catch(error => res.send(error))


    },
    'adminIndex': function (req, res) {
        db.Users.findByPk(req.session.user.id)
        .then(user => {
            res.render('Admin/adminIndex', {
                user
            })
        })
        .catch(error => res.send(error))
    },
    'productList': function (req, res) {
        db.Products.findAll()
            .then(products => {
                return res.render('Admin/productList', {
                    products,
                    toThousand,
                })


            })
            .catch(error => res.send(error))


    },
    'productEdit': function (req, res) {
        const id = req.params.id
        db.Products.findByPk(id)
            .then(product => {
                let feature = db.Features.findOne({
                    where: {
                        id: product.features_id
                    }
                });
                let tastingNote = db.TastingNotes.findOne({
                    where: {
                        id: product.tasting_notes_id
                    }
                }

                );


                Promise.all([feature, tastingNote])
                    .then(([feature, tastingNote]) => {
                        res.render('Admin/productEdit', {
                            product,
                            feature,
                            tastingNote,
                            toThousand
                        })
                    })
                    .catch(error => res.send(error))

            }).catch(error => res.send(error))




    },
    'productDetailAdmin': function (req, res) {
        const id = req.params.id
        db.Products.findByPk(id)
            .then(product => {
                let feature = db.Features.findOne({
                    where: {
                        id: product.features_id
                    }
                });
                let tastingNote = db.TastingNotes.findOne({
                    where: {
                        id: product.tasting_notes_id
                    }
                }

                );


                Promise.all([feature, tastingNote])
                    .then(([feature, tastingNote]) => {
                        res.render('Admin/productDetailAdmin', {
                            product,
                            feature,
                            tastingNote,
                            toThousand
                        })
                    })
                    .catch(error => res.send(error))

            }).catch(error => res.send(error))






    },
    'adminSearch': function (req, res) {
        const { search } = req.query
        db.Products.findAll({
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }

            }
        })
            .then(products => {
                return res.render('Admin/results', {
                    products,
                    search,
                    toThousand

                })
            })

            .catch(error => res.send(error))

    },
    'adminFilter': function (req, res) {
        res.render('Admin/adminFilter')
    },
    'productNew': function (req, res) {
        const { title, price, discount, product_category_id, free_shipping, cover_page, description, varietal, vintage, type_of_barrel, time_in_bottle, harvest, finca, terroir, smell, taste, color } = req.body

        const feature = db.Features.create({
            varietal,
            vintage,
            type_of_barrel,
            time_in_bottle,
            harvest,
            finca,
            terroir
        });

        const tastingNote = db.TastingNotes.create({
            color,
            smell,
            taste
        });


        Promise.all([feature, tastingNote])
            .then(([feature, tastingNote]) => {
                db.Products.create({
                    features_id: feature.id,
                    tasting_notes_id: tastingNote.id,
                    title,
                    price,
                    discount,
                    description,
                    product_category_id,
                    free_shipping,
                    cover_page,
                    image: req.files[0] ? req.files[0].filename : 'producto1.png',

                }).then(producto => {
                    res.redirect('/admin/products')

                })

                    .catch(error => res.send(error))

            })


            .catch(error => res.send(error))


    },

    'productUpdate': function (req, res) {
        const { id } = req.params;
        const { title, price, discount, product_category_id, free_shipping, cover_page, description, varietal, vintage, type_of_barrel, time_in_bottle, harvest, finca, terroir, smell, taste, color } = req.body

        db.Products.findByPk(id)
            .then(product => {
                const features = db.Features.update({
                    varietal,
                    vintage,
                    type_of_barrel,
                    time_in_bottle,
                    harvest,
                    finca,
                    terroir,
                },
                    {
                        where: {
                            id: product.features_id
                        }
                    }


                );
                const tastingNotes = db.TastingNotes.update({
                    smell,
                    taste,
                    color
                },
                    {
                        where: {
                            id: product.tasting_notes_id
                        }
                    }

                );

                const products = db.Products.update({
                    title,
                    price,
                    discount,
                    description,
                    product_category_id,
                    free_shipping: free_shipping ? 1 : 0,
                    cover_page: cover_page ? 1 : 0,
                    image: req.files[0] ? req.files[0].filename : undefined
                },
                    {
                        where: {
                            id: id
                        }
                    })
                Promise.all([features, tastingNotes, products])
                    .then(() => {

                        return res.redirect('/Admin/products/' + id)
                    })
                    .catch(error => res.send(error))
            })
            .catch(error => res.send(error))
    },
    'productDestroit': function (req, res) {
        const id = req.params.id
        db.Products.findByPk(id)
            .then((product) => {
                db.Products.destroy({

                    where: {
                        id: id
                    }

                })

                    .then(() => {
                        const features = db.Features.destroy({
                            where: {
                                id: product.features_id
                            }
                        })
                        const tastingNotes = db.TastingNotes.destroy({
                            where: {
                                id: product.tasting_notes_id
                            }
                        })

                        Promise.all([features, tastingNotes])
                            .then(() => {
                                return res.redirect('/admin/products')
                            })
                            .catch(error => res.send(error))

                    }).catch(error => res.send(error))
            })
            .catch(error => res.send(error))

    },

    'messageList': function (req, res) {

        db.Messages.findAll()
            .then(messages => {
                return res.render('Admin/messagesList', {
                    messages,


                })


            })
            .catch(error => res.send(error))


    },

    'messageDetail': function (req, res) {
        const id = req.params.id
        db.Messages.findByPk(id)
            .then(message => {
                return res.render('Admin/messageDetail', {
                    message,


                })
            })

            .catch(error => res.send(error))
    },
    'messageDestroit': function (req, res) {
        const id = req.params.id
        db.Messages.findByPk(id)
            .then(() => {
                db.Messages.destroy({

                    where: {
                        id: id
                    }

                })
                    .then(() => {
                        return res.redirect('/admin/list')
                    })
                    .catch(error => res.send(error))
            })

    },

    'messageUpdate': function (req, res) {
        const id = req.params.id
        db.Messages.findByPk(id)
            .then((message) => {
                db.Messages.update({
                   status:1
                },
                    {
                        where: {
                            id: message.id
                        }
                    }
    
                )
                    .then(() => {
                        return res.redirect('/admin/messageDetail/'+ id )
                    })
                    .catch(error => res.send(error))
            })


            


    },

    'userList': function (req, res) {
        db.Users.findAll()
            .then(users => {
                return res.render('Admin/userList', {
                    users,
                    
                })


            })
            .catch(error => res.send(error))


    },

    'userDetail': function (req, res) {
        const id = req.params.id
        db.Users.findByPk(id)
        .then(user => {
            res.render('Admin/userDetail',{
                user
            })
        })
        .catch(error => res.send(error));
    },

    'userUpdated': function (req, res) {
        const id = req.params.id
        const {category_id} = req.body
        db.Users.findByPk(id)
            .then((user) => {
                db.Users.update({
                   category_id: category_id
                },
                    {
                        where: {
                            id: user.id
                        }
                    }
    
                )
                    .then(() => {
                        return res.redirect('/Admin/userList')
                    })
                    .catch(error => res.send(error))
            })
    },

    'userDestroit': function (req,res){
        const id = req.params.id
        db.Users.findByPk(id)
            .then((user) => {
                db.Users.destroy({

                    where: {
                        id: id
                    }

                }).then(() => {
                    return res.redirect('/admin/userList')
                }).catch(error => res.send(error))
                 
             }).catch(error => res.send(error)) 
    },

   /* 'perfil': function (req, res) {
        db.Users.findByPk(req.session.user.id)
        .then(user => {
            res.render('Users/perfilDetail', {
                user
            })
        })
        .catch(error => res.send(error))
},

'perfilEdit': function (req, res) {

    db.Users.findByPk(req.session.user.id)
        .then(user => {

            let date_of_birth = moment(user.date_of_birth).format('YYYY-MM-DD')
            res.render('Users/perfilEdit', {
                user,
                date_of_birth
            })
        })
        .catch(error => res.send(error))
},

'perfilUpdate': function (req, res) {
    const { name, lastname, password, date, sex_id } = req.body

    let errores = validationResult(req);


    if (!errores.isEmpty()) {
        db.Users.findByPk(req.session.user.id)
            .then(user => {
                let date_of_birth = moment(user.date_of_birth).format('YYYY-MM-DD')

                res.render('Users/perfilEdit', {
                    user,
                    date_of_birth,
                    erroresEdit: errores.mapped(),
                    old:req.body,
                })
            })
            .catch(error => res.send(error));
    } else {

        db.Users.update(
            {
                name: name.trim(),
                lastname: lastname.trim(),
                password: password.length != 0 ? bcrypt.hashSync(password, 12) : undefined,
                date_of_birth: date,
                avatar: req.files[0] ? req.files[0].filename : 'default.png',
                category_id: 1,
                sex_id

            },
            {
                where: {
                    id: req.session.user.id
                }
            })
            .then(() => {
                return res.redirect('/ingreso/perfil')
            })
            .catch(error => res.send(error))
    }
}*/







}


module.exports = adminController;