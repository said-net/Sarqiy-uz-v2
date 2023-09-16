const fs = require('fs');
const path = require('path')

module.exports = () => {
    fs.readdir('./public', (err) => {
        if (err) {
            fs.mkdir(path.join('./', 'public'), (err) => {
                if (err) {
                    console.log("Public error");
                } else {
                    fs.readdir('./public/competitions', (err) => {
                        if (err) {
                            fs.mkdir(path.join('./', 'public', 'competitons'), (err) => {
                                if (err) {
                                    console.log("Competitons error");
                                }
                            })
                        }
                    })
                    fs.readdir('./public/categories', (err) => {
                        if (err) {
                            fs.mkdir(path.join('./', 'public', 'categories'), (err) => {
                                if (err) {
                                    console.log("Categories error");
                                }
                            })
                        }
                    })
                    fs.readdir('./public/products', (err) => {
                        if (err) {
                            fs.mkdir(path.join('./', 'public', 'products'), (err) => {
                                if (err) {
                                    console.log("Products error");
                                }
                            })
                        }
                    })
                    fs.readdir('./public/cheques', (err) => {
                        if (err) {
                            fs.mkdir(path.join('./', 'public', 'cheques'), (err) => {
                                if (err) {
                                    console.log("Cheques error");
                                }
                            })
                        }
                    })
                    fs.readdir('./public/ads', (err) => {
                        if (err) {
                            fs.mkdir(path.join('./', 'public', 'ads'), (err) => {
                                if (err) {
                                    console.log("Ads error");
                                }
                            })
                        }
                    })
                    fs.readdir('./public/main', (err) => {
                        if (err) {
                            fs.mkdir(path.join('./', 'public', 'main'), (err) => {
                                if (err) {
                                    console.log("Main error");
                                }
                            })
                        }
                    })
                }
            })
        } else {
            fs.readdir('./public/competitions', (err) => {
                if (err) {
                    fs.mkdir(path.join('./', 'public', 'competitions'), (err) => {
                        if (err) {
                            console.log("Competitons error");
                        }
                    })
                }
            })
            fs.readdir('./public/categories', (err) => {
                if (err) {
                    fs.mkdir(path.join('./', 'public', 'categories'), (err) => {
                        if (err) {
                            console.log("Categories error");
                        }
                    })
                }
            })
            fs.readdir('./public/products', (err) => {
                if (err) {
                    fs.mkdir(path.join('./', 'public', 'products'), (err) => {
                        if (err) {
                            console.log("Products error");
                        }
                    })
                }
            })
            fs.readdir('./public/cheques', (err) => {
                if (err) {
                    fs.mkdir(path.join('./', 'public', 'cheques'), (err) => {
                        if (err) {
                            console.log("Cheques error");
                        }
                    })
                }
            })
            fs.readdir('./public/ads', (err) => {
                if (err) {
                    fs.mkdir(path.join('./', 'public', 'ads'), (err) => {
                        if (err) {
                            console.log("Ads error");
                        }
                    })
                }
            })
            fs.readdir('./public/main', (err) => {
                if (err) {
                    fs.mkdir(path.join('./', 'public', 'main'), (err) => {
                        if (err) {
                            console.log("Main error");
                        }
                    });
                }
            });
        }
    });

}