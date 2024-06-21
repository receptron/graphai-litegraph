export const defaultData = {
  "last_node_id":8,"last_link_id":5,"nodes":
  [{"id":1,"type":"data/copy","pos":{"0":200,"1":100,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":140,"1":26},"flags":{},"order":0,"mode":0,"inputs":[{"name":"In","type":"string","link":null}],"outputs":[{"name":"Output","type":"string","links":[1]}],"properties":{}},
   {"id":2,"type":"data/total","pos":{"0":700,"1":100,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":140,"1":26},"flags":{},"order":4,"mode":0,"inputs":[{"name":"In","type":"string","link":1}],"outputs":[{"name":"Output","type":"string","links":null}],"properties":{}},
   {"id":3,"type":"llm/openAI","pos":{"0":700,"1":200,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":210,"1":446},"flags":{},"order":5,"mode":0,"inputs":[{"name":"model","type":"string","link":null},{"name":"system","type":"string","link":3},{"name":"tools","type":"object","link":null},{"name":"tool_choice","type":0,"link":null},{"name":"max_tokens","type":"number","link":null},{"name":"verbose","type":"boolean","link":null},{"name":"temperature","type":"number","link":null},{"name":"baseURL","type":"string","link":null},{"name":"apiKey","type":0,"link":null},{"name":"stream","type":"boolean","link":null},{"name":"prompt","type":"string","link":2},{"name":"messages","type":0,"link":null}],"outputs":[{"name":"llmResponse","type":"string","links":null}],"properties":{},"widgets_values":["","","",false,"","",false,""]},
   {"id":4,"type":"static/string","pos":{"0":200,"1":200,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":210,"1":58},"flags":{},"order":1,"mode":0,"inputs":[],"outputs":[{"name":"Output","type":"string","links":[2]}],"properties":{},"widgets_values":[""]},
   {"id":5,"type":"static/string","pos":{"0":200,"1":300,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":210,"1":58},"flags":{},"order":2,"mode":0,"inputs":[],"outputs":[{"name":"Output","type":"string","links":[3]}],"properties":{},"widgets_values":[""]},
   {"id":6,"type":"array/pop","pos":{"0":400,"1":400,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":140,"1":46},"flags":{},"order":6,"mode":0,"inputs":[{"name":"array","type":"array","link":4}],"outputs":[{"name":"item","links":null},{"name":"array","type":"array","links":[5]}],"properties":{}},
   {"id":7,"type":"array/shift","pos":{"0":200,"1":400,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":140,"1":46},"flags":{},"order":3,"mode":0,"inputs":[{"name":"array","type":"array","link":null}],"outputs":[{"name":"item","links":null},{"name":"array","type":"array","links":[4]}],"properties":{}},
   {"id":8,"type":"array/push","pos":{"0":600,"1":400,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},"size":{"0":140,"1":46},"flags":{},"order":7,"mode":0,"inputs":[{"name":"array","type":"array","link":5},{"name":"item","type":0,"link":null}],"outputs":[{"name":"Output","type":"string","links":null}],"properties":{}}],"links":[[1,1,0,2,0,"string"],[2,4,0,3,10,"string"],[3,5,0,3,1,"string"],[4,7,1,6,0,"array"],[5,6,1,8,0,"array"]],"groups":[],"config":{},"extra":{},"version":0.4}