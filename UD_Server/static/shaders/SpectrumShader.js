var SpectrumShader = {

    uniforms: {

        "tDiffuse": { value: null },
        "amount":   { value: 1.0 },
        "gamma" : {value: 0.5},
        "numColors": {value: 2},

    },

    vertexShader: [

        "varying vec2 vUv;",

        "void main() {",

            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"

    ].join( "\n" ),

    fragmentShader: [

        "uniform float amount;",

        "uniform sampler2D tDiffuse;",

        "uniform float gamma; //0.6;",

        "uniform float numColors; //8.0;",

        "varying vec2 vUv;",

        "void main() {",

            "vec4 color = texture2D( tDiffuse, vUv );",
            "vec3 c = color.rgb;",

            "//color.r = dot( c, vec3( 1.0 - 0.607 * amount, 0.769 * amount, 0.189 * amount ) );",
            "//color.g = dot( c, vec3( 0.349 * amount, 1.0 - 0.314 * amount, 0.168 * amount ) );",
            "//color.b = dot( c, vec3( 0.272 * amount, 0.534 * amount, 1.0 - 0.869 * amount ) );",

            "c = pow(c, vec3(gamma, gamma, gamma));",
            "c = c * numColors;",
            "c = floor(c);",
            "c = c / numColors;",
            "c = pow(c, vec3(1.0/gamma));",
            "gl_FragColor = vec4(c, 1.0);",

            "//gl_FragColor = vec4( min( vec3( 1.0 ), color.rgb ), color.a );",

        "}"

    ].join( "\n" )

};