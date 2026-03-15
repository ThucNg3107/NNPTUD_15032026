var express = require('express');
var router = express.Router();

let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');


/* GET roles */
router.get('/', async function(req,res,next){

    let result = await roleModel.find({
        isDeleted:false
    });

    res.send(result);

});


router.get('/:id', async function(req,res,next){

    try{

        let id = req.params.id;

        let result = await roleModel.findOne({
            isDeleted:false,
            _id:id
        });

        if(result){
            res.send(result);
        }else{
            res.status(404).send({message:"role not found"});
        }

    }catch(error){
        res.status(400).send(error);
    }

});


/* CREATE ROLE */
router.post('/', async function(req,res,next){

    try{
        let body = req.body || {};

        // Normalize keys to avoid issues from accidental spaces/hidden chars in Postman.
        const normalized = {};
        if (typeof body === 'object' && body !== null) {
            Object.entries(body).forEach(([key, value]) => {
                const normalizedKey = String(key)
                    .normalize('NFKC')
                    .replace(/[\u200B-\u200D\uFEFF]/g, '')
                    .trim()
                    .toLowerCase();
                normalized[normalizedKey] = value;
            });
        }

        const payload = {
            name: normalized.name,
            description: normalized.description || ''
        };

        if (!payload.name) {
            return res.status(400).send({
                message: 'name is required',
                receivedBody: body,
                receivedKeys: Object.keys(body || {})
            });
        }

        let role = new roleModel(payload);

        await role.save();

        res.send(role);

    }catch(error){
        res.status(400).send(error);
    }

});


/* UPDATE ROLE */
router.put('/:id', async function(req,res,next){

    try{

        let id = req.params.id;

        let result = await roleModel.findOneAndUpdate(
            {
                _id:id,
                isDeleted:false
            },
            req.body,
            {new:true}
        );

        if(result){
            res.send(result);
        }else{
            res.status(404).send({message:"role not found"});
        }

    }catch(error){
        res.status(400).send(error);
    }

});


/* DELETE ROLE (soft delete) */
router.delete('/:id', async function(req,res,next){

    try{

        let id = req.params.id;

        let result = await roleModel.findByIdAndUpdate(
            id,
            {isDeleted:true},
            {new:true}
        );

        if(result){
            res.send(result);
        }else{
            res.status(404).send({message:"role not found"});
        }

    }catch(error){
        res.status(400).send(error);
    }

});


/* GET USERS BY ROLE */
router.get('/:id/users', async function(req,res,next){

    try{

        let id = req.params.id;

        let result = await userModel.find({
            role:id,
            isDeleted:false
        }).populate("role");

        res.send(result);

    }catch(error){
        res.status(400).send(error);
    }

});


module.exports = router;
