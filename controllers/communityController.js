const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Item_category = require('../models/item_categoryModel');
const Community = require('../models/communityModel');
const Item = require('../models/itemModel');
const Shared = require('../shared');

function getCommunityId (params_id, cookies_id) {
  if (!isNaN(params_id)) {
    return params_id
  } else if (!isNaN(cookies_id)) {
    return cookies_id
  } else {
    return false
  };
}


function getCommunity (req, res) {
  Shared.allowOrigin(res, req);

  const id = getCommunityId(req.params.id, req.signedCookies['community_id'])
  if (id) {
    const decoded = Shared.decodeToken(req);
    console.log('decoded token is: ',decoded)
    
    Community
    .getOne(id, decoded.user_id)
    .then(community => {
      if (community) {
        const isSecure = req.app.get('env') !='development';
        res.cookie('community_id', id, {
            httpOnly: true,
            secure: isSecure,
            signed: true
        });
        res.json(community);
      } else {
        resError(res, 404, "Community Not Found");
      }
    });
  } else {
    resError(res, 500, "Invalid ID");
  }

};

function validCommunity(community) {
    const validName = community.name.trim() != '';
    const validDescription = community.description.trim() != ''; 
    return validName && validDescription
};

function validCommunityUser(community_id, user_id) {
  Community.getOne(community_id).then(community => {
      if (community) {
       console.log(community);
      User.getOne(user_id).then(user => {
        console.log(user);
        return true
      });
    } else {
      console.log(false);
      return false
    };
  });
}

function createCommunity (req, res, next) {
  console.log('request body', req.body)
  Shared.allowOrigin(res, req);
  if(validCommunity(req.body)) {
    const decoded = Shared.decodeToken(req);
    Community
      .getOneByName(req.body.name)
      .then(community => {
        if(!community) {
          Shared.allowOrigin(res, req);
          const community = {
            name: req.body.name,
            description: req.body.description,
            community_type: req.body.community_type,
            created_at: new Date()
          };
      
          Community
            .create(community)
            .then(id => {        
              const user_community_add = {
                user_id : decoded.user_id,
                community_id : id,
                role : 2,
                created_at : new Date(),
                };
              Community
              .addUser(user_community_add)
              console.log('posted success')
              res.json({
                id,
                message: 'community posted'
                });
              })
        } else {
          next(new Error('Community name in use'));
        }
      })
    
    
    // redirect
    } else {
        next(new Error('Invalid community'))
    }
    };

function getCommunityItems (req,res) {
  const decoded = Shared.decodeToken(req);
  Shared.allowOrigin(res, req);
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res, req);
    Community.getOneToUpdate(req.params.id, decoded.user_id).then(community => {
      if (community) {
        Item.getByCommunity(req.params.id).then(items => {
          res.json(items);
        });
      } else {
        resError(res, 404, "Community not found");
      }
    })
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function getCommunityCategories (req,res) {
  const decoded = Shared.decodeToken(req);
  Shared.allowOrigin(res, req);
  if (!isNaN(req.params.id)) {
    Shared.allowOrigin(res, req);
    Community.getOneToUpdate(req.params.id, decoded.user_id).then(community => {
      if (community) {
        Item_category.getByCommunity(req.params.id, decoded.user_id).then(items => {
          console.log(items);
          res.json(items);
        });
      } else {
        resError(res, 404, "Community not found");
      }
    })
  } else {
    resError(res, 500, "Invalid ID");
  }
};


function updateCommunity (req, res) {
  if (!isNaN(req.params.id)) {
    const decoded = Shared.decodeToken(req);
    Shared.allowOrigin(res, req);
    Community.getOneToUpdate(req.params.id, decoded.user_id).then(community => {
    if (community && community.role > 0) {
      console.log(community);
      const community_update = {
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        community_type: req.body.community_type,
      };
      Community
        .update(community_update)
        .then(id => {
          res.json({
            message: 'community updated'
            });
    }); //can probably simplify this function; don't need the id
  } else {
      if (community) {
        resError(res, 404, "Permission denied")
      } else {
        resError(res, 404, "Community Not Found");
      }
      
  }
  });
  } else {
    resError(res, 500, "Invalid ID");
  }
};

function deleteCommunity (req, res) {
  if (!isNaN(req.params.id)) {
      const decoded = Shared.decodeToken(req);
      Shared.allowOrigin(res, req);
      Community.getOneToUpdate(req.params.id, decoded.user_id).then(community => {
      if (community && community.role > 0) {
          Community.delete(req.params.id).then(id => {
            res.json({
                message: 'community deleted'
                });
              });
      } else {
        if (community) {
          resError(res, 404, "Permission Denied");
        } else {
          resError(res, 404, "Community Not Found");
        }
          
      }
      });
  } else {
      resError(res, 500, "Invalid ID");
  }
};

function addUserToCommunity (req, res, next) {
  const decoded = Shared.decodeToken(req);
  Shared.allowOrigin(res, req);
  const user_id = req.params.id;
  const community_id = req.body.community_id;
  const user_community_add = {
    user_id : req.params.id,
    community_id : req.body.community_id,
    role : 0,
    created_at : new Date(),
  }
  Community.getOne(community_id, decoded.user_id).then(community => {
    if (community && community.role > 0) {
      User.getOne(user_id).then(user => {
        if(user) {
          Community.getUserCommunity(user_id, community_id).then(user_community => {
            if(!user_community) {
              Community
              .addUser(user_community_add)
              .then(id => {
                res.json({
                    id,
                    message: 'User added to Community'
                    });
                  })
                } else {
                  resError(res, 404, "User already added to Community");
                }
            })
          
        } else {
          res.json({message : 'Invalid User'})
        }
    });
  } else {
    if (community) {
      resError(res, 404, "Access Denied")
    } else {
      resError(res, 404, "Invalid Community")
    }
    
    };
  });
};

function removeUserFromCommunity (req, res) {
  if (!isNaN(req.params.id)) {
      const decoded = Shared.decodeToken(req);
      Shared.allowOrigin(res, req);
      Community.getUserCommunity(decoded.user_id,req.body.community_id).then(auth => {
        Community.getUserCommunity(req.params.id, req.body.community_id).then(user_community => {
          if (user_community) {
            console.log('auth role: ', auth.role, ' user role: ', user_community.role)
            if (auth.role > user_community.role){
              Community.removeUser(user_community.id)
              .then(res.json(user_community));
            } else {
              resError(res, 404, "Unauthorized");
            }
           } else {
              resError(res, 404, "Community Not Found");
          }
          });
      })
      
  } else {
      resError(res, 500, "Invalid ID");
  }
};




function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports =  {
  getCommunityId,
  getCommunity,
  validCommunity,
  validCommunityUser,
  createCommunity,
  getCommunityItems,
  getCommunityCategories,
  updateCommunity,
  deleteCommunity,
  addUserToCommunity,
  removeUserFromCommunity,
  resError
};