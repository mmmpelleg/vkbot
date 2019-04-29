module.exports = (() => {
  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = 'SyntaxError';

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    const options = arguments.length > 1 ? arguments[1] : {};
    const parser = this;
    const peg$FAILED = {};
    const peg$startRuleFunctions = {template: peg$parsetemplate};
    let peg$startRuleFunction = peg$parsetemplate;
    const peg$c0 = '/';
    const peg$c1 = {type: 'literal', value: '/', description: '"/"'};
    const peg$c2 = segments => {
      return segments;
    };
    const peg$c3 = (s, segments) => {
      return s.concat(segments);
    };
    const peg$c4 = s => {
      return s;
    };
    const peg$c5 = '{';
    const peg$c6 = {type: 'literal', value: '{', description: '"{"'};
    const peg$c7 = '=';
    const peg$c8 = {type: 'literal', value: '=', description: '"="'};
    const peg$c9 = '}';
    const peg$c10 = {type: 'literal', value: '}', description: '"}"'};
    const peg$c11 = (l, segments) => {
      return [
        {kind: extras.BINDING, literal: l},
        segments,
        {kind: extras.END_BINDING, literal: ''},
      ].reduce((a, b) => a.concat(b), []);
    };
    const peg$c12 = l => {
      return [
        {kind: extras.BINDING, literal: l},
        {kind: extras.TERMINAL, literal: '*'},
        {kind: extras.END_BINDING, literal: ''},
      ];
    };
    const peg$c13 = (t, segments) => {
      return t.concat(segments);
    };
    const peg$c14 = t => {
      if (t[0].literal === '*' || t[0].literal === '**') {
        return [
          {
            kind: extras.BINDING,
          },
          t[0],
          {kind: extras.END_BINDING, literal: ''},
        ];
      } else {
        return t;
      }
    };
    const peg$c15 = '**';
    const peg$c16 = {type: 'literal', value: '**', description: '"**"'};
    const peg$c17 = '*';
    const peg$c18 = {type: 'literal', value: '*', description: '"*"'};
    const peg$c19 = l => {
      return [{kind: extras.TERMINAL, literal: l}];
    };
    const peg$c20 = /^[^*=}{\/]/;
    const peg$c21 = {type: 'class', value: '[^*=}{/]', description: '[^*=}{/]'};
    const peg$c22 = cs => {
      return cs.join('');
    };
    let peg$currPos = 0;
    let peg$savedPos = 0;
    const peg$posDetailsCache = [{line: 1, column: 1, seenCR: false}];
    let peg$maxFailPos = 0;
    let peg$maxFailExpected = [];
    const peg$silentFails = 0;
    let peg$result;

    if ('startRule' in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error(
          'Can\'t start parsing from rule "' + options.startRule + '".'
        );
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{type: 'other', description}],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      let details = peg$posDetailsCache[pos],
        p,
        ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line: details.line,
          column: details.column,
          seenCR: details.seenCR,
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === '\n') {
            if (!details.seenCR) {
              details.line++;
            }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === '\r' || ch === '\u2028' || ch === '\u2029') {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      const startPosDetails = peg$computePosDetails(startPos),
        endPosDetails = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line: startPosDetails.line,
          column: startPosDetails.column,
        },
        end: {
          offset: endPos,
          line: endPosDetails.line,
          column: endPosDetails.column,
        },
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) {
        return;
      }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        let i = 1;

        expected.sort((a, b) => {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) {
            return ch
              .charCodeAt(0)
              .toString(16)
              .toUpperCase();
          }

          return s
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\f/g, '\\f')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, ch => {
              return '\\x0' + hex(ch);
            })
            .replace(/[\x10-\x1F\x80-\xFF]/g, ch => {
              return '\\x' + hex(ch);
            })
            .replace(/[\u0100-\u0FFF]/g, ch => {
              return '\\u0' + hex(ch);
            })
            .replace(/[\u1000-\uFFFF]/g, ch => {
              return '\\u' + hex(ch);
            });
        }

        const expectedDescs = new Array(expected.length);
        let expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc =
          expected.length > 1
            ? expectedDescs.slice(0, -1).join(', ') +
              ' or ' +
              expectedDescs[expected.length - 1]
            : expectedDescs[0];

        foundDesc = found ? '"' + stringEscape(found) + '"' : 'end of input';

        return 'Expected ' + expectedDesc + ' but ' + foundDesc + ' found.';
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsetemplate() {
      let s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 47) {
        s1 = peg$c0;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c1);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsebound_segments();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsebound_segments();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsebound_segments() {
      let s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsebound_segment();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
          s2 = peg$c0;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c1);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsebound_segments();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c3(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsebound_segment();
      }

      return s0;
    }

    function peg$parsebound_segment() {
      let s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsebound_terminal();
      if (s1 === peg$FAILED) {
        s1 = peg$parsevariable();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c4(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsevariable() {
      let s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c5;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c6);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseliteral();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c8);
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseunbound_segments();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s5 = peg$c9;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c11(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 123) {
          s1 = peg$c5;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c6);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseliteral();
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 125) {
              s3 = peg$c9;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c10);
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c12(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseunbound_segments() {
      let s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseunbound_terminal();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 47) {
          s2 = peg$c0;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c1);
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseunbound_segments();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c13(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseunbound_terminal();
      }

      return s0;
    }

    function peg$parsebound_terminal() {
      let s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseunbound_terminal();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c14(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseunbound_terminal() {
      let s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c15) {
        s1 = peg$c15;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c16);
        }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 42) {
          s1 = peg$c17;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c18);
          }
        }
        if (s1 === peg$FAILED) {
          s1 = peg$parseliteral();
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c19(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseliteral() {
      let s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c20.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c21);
        }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c20.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c21);
            }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c22(s1);
      }
      s0 = s1;

      return s0;
    }

    const extras = require('./parserExtras');

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({type: 'end', description: 'end of input'});
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse: peg$parse,
  };
})();
