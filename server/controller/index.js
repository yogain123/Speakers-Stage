var AWS = require('aws-sdk');
var region = "ap-south-1";
const jwt = require('jsonwebtoken')
var {
    accessKeyId,
    secretAccessKey,
    secret
} = require("../configuration/local");


let configObjAWS = {
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
};

var dynamoDB = new AWS.DynamoDB.DocumentClient(configObjAWS);

exports.deleteSession = async (email) => {
    try {
        var params = {
            TableName: "SESSION",
            Key: {
                email
            }
        };
        await dynamoDB.delete(params).promise();
    } catch (error) {
        throw {
            status: false,
            message: "Something went Wrong"
        }
    }
}

exports.getUser = async (email) => {

    try {
        let params = {
            KeyConditionExpression: "#email = :email",
            ExpressionAttributeNames: {
                "#email": "email",
            },
            ExpressionAttributeValues: {
                ":email": email
            },
            TableName: "USERS"
        };
        let data = await dynamoDB.query(params).promise();
        return data.Items[0];
    } catch (error) {
        throw {
            status: false,
            message: "Something went Wrong"
        }
    }
}

exports.createUser = async (reqData) => {
    try {
        let params = {
            Item: reqData,
            ReturnConsumedCapacity: "TOTAL",
            TableName: "USERS",
        };
        await dynamoDB.put(params).promise();
        return;
    } catch (error) {
        throw {
            status: false,
            message: "Something went Wrong"
        }
    }
}

exports.createSession = async (reqData) => {
    try {
        let params = {
            Item: reqData,
            ReturnConsumedCapacity: "TOTAL",
            TableName: "SESSION",
        };
        dynamoDB.put(params).promise();
        return;
    } catch (error) {
        throw {
            status: false,
            message: "Something went Wrong"
        }
    }
}

exports.getPostUsingEmail = async (email) => {
    try {
        let params = {
            KeyConditionExpression: "#email = :email",
            ExpressionAttributeNames: {
                "#email": "email",
            },
            ExpressionAttributeValues: {
                ":email": email
            },
            TableName: "POSTS"
        };
        let data = await dynamoDB.query(params).promise();
        allPosts = data.Items.map(item => {
            delete item.email;
            return item;
        });
        return allPosts;
    } catch (error) {
        throw {
            status: false,
            message: "Something went Wrong"
        }
    }
}

exports.getPostUsingPostId = async (postId) => {
    try {
        var conditionExpression = "#postId = :postId";
        var attributeName = {
            "#postId": "postId"
        };

        var attributeVal = {
            ":postId": postId
        };
        let params = {
            KeyConditionExpression: conditionExpression,
            ExpressionAttributeNames: attributeName,
            ExpressionAttributeValues: attributeVal,
            TableName: "POSTS",
            IndexName: "postId-index",
        };

        let data = await dynamoDB.query(params).promise();
        return data.Items[0];
    } catch (error) {
        throw {
            status: false,
            message: "Something went Wrong"
        }
    }
}

exports.createPost = async (reqData) => {
    try {
        let params = {
            Item: reqData,
            ReturnConsumedCapacity: "TOTAL",
            TableName: "POSTS",
        };
        dynamoDB.put(params).promise();
        return;
    } catch (error) {
        throw {
            status: false,
            message: "Something went Wrong"
        }
    }
}

exports.authorization = async (req, res, next) => {

    try {
        let decoded = jwt.verify(req.headers.apikey, secret);
        email = decoded.email
        let params = {
            KeyConditionExpression: "#email = :email",
            ExpressionAttributeNames: {
                "#email": "email",
            },
            ExpressionAttributeValues: {
                ":email": email
            },
            TableName: "SESSION"
        };
        let data = await dynamoDB.query(params).promise();
        if (data.Items[0] && data.Items[0].sessionId == req.headers.apikey) {
            Object.assign(req.body, {
                email
            })
            next();
        } else
            throw {}
    } catch (error) {
        res.send({
            status: "false",
            info: "Invalid Token or You might be logged out"
        });
    }
}