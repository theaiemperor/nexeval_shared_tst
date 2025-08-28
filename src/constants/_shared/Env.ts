const env = {
    node_env: "development",
    jwt_secret: process.env.JWT_SECRET || "",
    port: 3000,
    protocol: "https",
    mongo_url: "",
    redis_url: "",
    postgres_url: "",

}


export default env;