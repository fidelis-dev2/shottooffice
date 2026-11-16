/* Shotto Office · visual templates. Each @1, @2 … corresponds to one editable field. */
(function () {
  'use strict';
  const groups = [];
  let group;
  const raw = String.raw;
  function section(id, label, symbol) {
    group = { id, label, symbol, items: [] };
    groups.push(group);
  }
  function formula(id, label, pattern, ...fields) {
    group.items.push({
      id, label, pattern,
      fields: fields.map(field => {
        const [name, value = ''] = field.split('|');
        return { name, value };
      })
    });
  }
  section('fractions', 'Fractions · Sehemu', '½');
  formula('fraction', 'Fraction', raw`\frac{@1}{@2}`, 'Numerator · Juu|a', 'Denominator · Chini|b');
  formula('mixed', 'Mixed number', raw`@1\,\frac{@2}{@3}`, 'Whole number|2', 'Numerator|1', 'Denominator|3');
  formula('ratio', 'Ratio', '@1:@2', 'First part|a', 'Second part|b');
  formula('proportion', 'Proportion', raw`\frac{@1}{@2}=\frac{@3}{@4}`, 'Numerator 1|a', 'Denominator 1|b', 'Numerator 2|c', 'Denominator 2|d');
  formula('reciprocal', 'Reciprocal', raw`\frac{1}{@1}`, 'Value|x');
  formula('percent', 'Percentage', raw`\frac{@1}{@2}\times100\%`, 'Part|a', 'Whole|b');
  section('powers', 'Powers & roots', '√');
  formula('square', 'Square', '{@1}^{2}', 'Base|x');
  formula('power', 'Power', '{@1}^{@2}', 'Base|x', 'Exponent|n');
  formula('sqrt', 'Square root', raw`\sqrt{@1}`, 'Radicand|x');
  formula('cube-root', 'Cube root', raw`\sqrt[3]{@1}`, 'Radicand|x');
  formula('root', 'Nth root', raw`\sqrt[@1]{@2}`, 'Index|n', 'Radicand|x');
  formula('subscript', 'Subscript', '{@1}_{@2}', 'Base|a', 'Index|n');
  formula('subsup', 'Subscript and exponent', '{@1}_{@2}^{@3}', 'Base|x', 'Index|i', 'Exponent|2');
  formula('scientific', 'Scientific notation', raw`@1\times10^{@2}`, 'Coefficient|6.02', 'Exponent|23');
  section('algebra', 'Algebra', 'x²');
  formula('quadratic', 'Quadratic formula', raw`@1=\frac{-{@3}\pm\sqrt{{@3}^{2}-4{@2}{@4}}}{2{@2}}`, 'Variable|x', 'Coefficient a|a', 'Coefficient b|b', 'Coefficient c|c');
  formula('quadratic-equation','Quadratic equation', '{@1}{@4}^{2}+{@2}{@4}+{@3}=0','a|a','b|b','c|c','Variable|x');
  formula('linear', 'Straight line', '@1={@2}{@3}+@4', 'Output|y', 'Slope|m', 'Input|x', 'Intercept|c');
  formula('slope','Slope from two points',raw`m=\frac{@2-@1}{@4-@3}`,'First y|y_1','Second y|y_2','First x|x_1','Second x|x_2');
  formula('absolute', 'Absolute value', raw`\left|@1\right|`, 'Expression|x');
  formula('group', 'Parentheses', raw`\left(@1\right)`, 'Expression|a+b');
  formula('brackets', 'Square brackets', raw`\left[@1\right]`, 'Expression|x');
  formula('factor', 'Difference of squares', raw`{@1}^2-{@2}^2=\left(@1-@2\right)\left(@1+@2\right)`, 'First term|a', 'Second term|b');
  formula('binomial-square', 'Square of a sum', raw`\left(@1+@2\right)^2={@1}^2+2{@1}{@2}+{@2}^2`, 'First term|a', 'Second term|b');
  formula('piecewise', 'Piecewise function',raw`f(x)=\begin{cases}@1&@2\\@3&@4\end{cases}`,'First expression|x^2','First condition|x<0','Second expression|x','Second condition|x\\ge0');
  section('geometry','Geometry & measurement','△');
  formula('circle-area','Area of a circle',raw`A=\pi {@1}^{2}`,'Radius|r');
  formula('circumference','Circumference',raw`C=2\pi {@1}`,'Radius|r');
  formula('triangle-area','Area of a triangle',raw`A=\frac{{@1}{@2}}{2}`,'Base|b','Height|h');
  formula('rectangle-area','Area of a rectangle',raw`A={@1}\times{@2}`,'Length|l','Width|w');
  formula('trapezium','Area of a trapezium',raw`A=\frac{(@1+@2){@3}}{2}`,'First parallel side|a','Second parallel side|b','Height|h');
  formula('pythagoras','Pythagorean theorem','{@3}^2={@1}^2+{@2}^2','Leg a|a','Leg b|b','Hypotenuse|c');
  formula('sphere','Volume of a sphere',raw`V=\frac{4}{3}\pi {@1}^{3}`,'Radius|r');
  formula('cylinder','Volume of a cylinder',raw`V=\pi {@1}^{2}{@2}`,'Radius|r','Height|h');
  formula('cone','Volume of a cone',raw`V=\frac{1}{3}\pi {@1}^{2}{@2}`,'Radius|r','Height|h');
  formula('distance','Cartesian distance',raw`d=\sqrt{(@2-@1)^2+(@4-@3)^2}`,'First x|x_1','Second x|x_2','First y|y_1','Second y|y_2');
  formula('arc','Arc length (radians)',raw`s={@1}{@2}`,'Radius|r','Angle in radians|\\theta');
  section('trig','Trigonometry','sin');
  for (const name of ['sin','cos','tan','cot','sec','csc']) {
    formula(name, name, '\\'+name+'\\left(@1\\right)', 'Angle|\\theta');
  }
  formula('inverse-sine','Inverse sine',raw`\sin^{-1}\left(@1\right)`,'Value|x');
  formula('trig-identity','Pythagorean identity',raw`\sin^2{@1}+\cos^2{@1}=1`,'Angle|\\theta');
  formula('cos-rule','Cosine rule',raw`{@3}^{2}={@1}^{2}+{@2}^{2}-2{@1}{@2}\cos{@4}`,'Side a|a','Side b|b','Side c|c','Angle C|C');
  formula('sine-rule','Sine rule',raw`\frac{@1}{\sin{@2}}=\frac{@3}{\sin{@4}}`,'Side a|a','Angle A|A','Side b|b','Angle B|B');
  section('logs','Logs & exponentials','log');
  formula('log','Logarithm',raw`\log_{@1}\left(@2\right)`,'Base|b','Argument|x');
  formula('ln','Natural logarithm',raw`\ln\left(@1\right)`,'Argument|x');
  formula('exp','Exponential','e^{@1}','Exponent|x');
  formula('change-base','Change of base',raw`\log_{@1}{@2}=\frac{\ln{@2}}{\ln{@1}}`,'Base|b','Argument|x');
  formula('growth','Exponential growth','@1={@2}e^{@3 @4}','Final amount|A','Initial amount|A_0','Rate|k','Time|t');
  section('calculus','Calculus','∫');
  formula('derivative','Derivative',raw`\frac{d}{d{@1}}\left(@2\right)`,'Variable|x','Function|x^2');
  formula('partial','Partial derivative',raw`\frac{\partial {@1}}{\partial {@2}}`,'Function|f','Variable|x');
  formula('second-derivative','Second derivative',raw`\frac{d^2{@1}}{d{@2}^2}`,'Function|y','Variable|x');
  formula('limit','Limit',raw`\lim_{@1\to @2}{@3}`,'Variable|x','Approaches|0','Expression|f(x)');
  formula('integral','Indefinite integral',raw`\int {@1}\,d{@2}`,'Integrand|x^2','Variable|x');
  formula('definite','Definite integral',raw`\int_{@1}^{@2}{@3}\,d{@4}`,'Lower bound|0','Upper bound|1','Integrand|x^2','Variable|x');
  formula('double','Double integral',raw`\iint_{@1}{@2}\,d{@3}\,d{@4}`,'Region|D','Integrand|f(x,y)','First variable|x','Second variable|y');
  formula('gradient','Gradient',raw`\nabla {@1}`,'Function|f');
  section('series','Sums & sequences','∑');
  formula('sum','Summation',raw`\sum_{@1}^{@2}{@3}`,'Lower bound|i=1','Upper bound|n','Term|i');
  formula('product','Product',raw`\prod_{@1}^{@2}{@3}`,'Lower bound|i=1','Upper bound|n','Factor|i');
  formula('arithmetic','Arithmetic nth term','a_{@1}={@2}+(@1-1){@3}','Term number|n','First term|a_1','Common difference|d');
  formula('geometric','Geometric nth term','a_{@1}={@2}{@3}^{@1-1}','Term number|n','First term|a_1','Common ratio|r');
  formula('arithmetic-sum','Arithmetic series',raw`S_{@1}=\frac{@1}{2}(2{@2}+(@1-1){@3})`,'Term count|n','First term|a','Difference|d');
  formula('infinite-series','Infinite geometric sum (|r| < 1)',raw`S=\frac{@1}{1-{@2}}`,'First term|a','Ratio|r');
  section('matrix','Matrices & vectors','[ ]');
  formula('matrix2','2 × 2 matrix',raw`\begin{pmatrix}@1&@2\\@3&@4\end{pmatrix}`,'Row 1 col 1|a','Row 1 col 2|b','Row 2 col 1|c','Row 2 col 2|d');
  formula('matrix3','3 × 3 matrix',raw`\begin{bmatrix}@1&@2&@3\\@4&@5&@6\\@7&@8&@9\end{bmatrix}`, ...'abcdefghi'.split('').map((v,i)=>'Row '+(1+Math.floor(i/3))+' col '+(1+i%3)+'|'+v));
  formula('det','2 × 2 determinant',raw`\begin{vmatrix}@1&@2\\@3&@4\end{vmatrix}`,'Row 1 col 1|a','Row 1 col 2|b','Row 2 col 1|c','Row 2 col 2|d');
  formula('vector','Vector',raw`\vec{@1}`,'Name|v');
  formula('column','Column vector',raw`\begin{pmatrix}@1\\@2\\@3\end{pmatrix}`,'First coordinate|x','Second coordinate|y','Third coordinate|z');
  formula('dot','Dot product',raw`\vec{@1}\cdot\vec{@2}`,'First vector|u','Second vector|v');
  formula('cross','Cross product',raw`\vec{@1}\times\vec{@2}`,'First vector|u','Second vector|v');
  formula('norm','Vector norm',raw`\left\lVert @1\right\rVert`,'Vector|v');
  section('probability','Probability & statistics','σ');
  formula('mean','Arithmetic mean',raw`\bar{x}=\frac{\sum_{i=1}^{@1}{@2}}{@1}`,'Sample size|n','Observation|x_i');
  formula('variance','Sample variance',raw`s^2=\frac{\sum_{i=1}^{@1}({@2}-{@3})^2}{@1-1}`,'Sample size|n','Observation|x_i','Mean|\\bar{x}');
  formula('sd','Standard deviation',raw`s=\sqrt{@1}`,'Sample variance|s^2');
  formula('zscore','Standard score',raw`z=\frac{@1-@2}{@3}`,'Value|x','Mean|\\mu','Standard deviation|\\sigma');
  formula('conditional','Conditional probability',raw`P(@1\mid @2)=\frac{P(@1\cap @2)}{P(@2)}`,'Event A|A','Event B|B');
  formula('bayes','Bayes’ theorem',raw`P(@1\mid @2)=\frac{P(@2\mid @1)P(@1)}{P(@2)}`,'Event A|A','Event B|B');
  formula('choose','Combinations',raw`\binom{@1}{@2}`,'Items|n','Chosen|r');
  formula('permutations','Permutations',raw`\frac{{@1}!}{(@1-@2)!}`,'Items|n','Selected|r');
  section('sets','Sets & logic','∪');
  formula('union','Union',raw`{@1}\cup{@2}`,'First set|A','Second set|B');
  formula('intersection','Intersection',raw`{@1}\cap{@2}`,'First set|A','Second set|B');
  formula('subset','Subset',raw`{@1}\subseteq{@2}`,'First set|A','Second set|B');
  formula('member','Membership',raw`{@1}\in{@2}`,'Element|x','Set|A');
  formula('implication','Implication',raw`{@1}\Rightarrow{@2}`,'First statement|P','Second statement|Q');
  formula('forall','Universal quantifier',raw`\forall {@1}\in{@2},\;{@3}`,'Variable|x','Set|\\mathbb{R}','Statement|P(x)');
  section('numbers','Number systems','ℂ');
  formula('complex','Complex number','z={@1}+{@2}i','Real part|a','Imaginary coefficient|b');
  formula('modulus','Complex modulus',raw`|z|=\sqrt{{@1}^2+{@2}^2}`,'Real part|a','Imaginary coefficient|b');
  formula('mod','Congruence',raw`{@1}\equiv{@2}\pmod{@3}`,'First integer|a','Second integer|b','Modulus|n');
  formula('factorial','Factorial','{@1}!','Integer|n');
  formula('floor','Floor',raw`\left\lfloor @1\right\rfloor`,'Value|x');
  formula('ceiling','Ceiling',raw`\left\lceil @1\right\rceil`,'Value|x');
  window.ShottoCatalog = groups;
})();
